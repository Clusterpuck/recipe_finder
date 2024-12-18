import React from 'react';
import { Button, ButtonGroup, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import ErrorBoundary from './ErrorBoundary';


const NUM_RESULTS = 10;
const API_KEY = "apiKey=c1c7bd93d67a4ac98fd6346c6a3ce1d2";
const API_ENDPOINT = "https://api.spoonacular.com/";
const AUTOCOMPLETE_URI = API_ENDPOINT + "food/ingredients/autocomplete?number="+ NUM_RESULTS + "&" + API_KEY;
const SEARCH_URI = API_ENDPOINT + "recipes/complexSearch?" + API_KEY;


const filters = {
    "dietary":["No Limits","Gluten Free","Ketogenic","Vegetarian","Lacto-Vegetarian","Ovo-Vegetarian","Vegan","Pescetarian","Paleo","Primal","Low FODMAP","Whole30"],
    "intolerances":["Dairy","Egg","Gluten","Grain","Peanut","Seafood","Sesame","Shellfish","Soy","Sulfite","Tree Nut","Wheat"],
    "cuisine":["African", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"],
    "type":["main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "marinade", "fingerfood", "snack", "drink"]
  };


//Request that includes all the ingredients in the list of the array
function apiIngredientList( apiString, ingredientList )
{
    const listSize = ingredientList.length;
    if( listSize > 0 )
    {
      apiString += "&includeIngredients=";
      for( var i = 0; i < listSize-1; i++ )
      {
        apiString += ingredientList[i] + ",";
      }
      apiString += ingredientList[listSize-1];
      apiString += "&sort=max-used-ingredients&number=5";
      console.log( "After apiIngList req is " + apiString);
    }
    return apiString;
}


function addAutoComplete(searchStr) 
{
    var filtStr = AUTOCOMPLETE_URI + "&query=" + searchStr;
    return filtStr;
}



//Search api based on a query word
function apiQuerySearch( apiStr, query )
{
  if( query !== "" && query != null)
    {
      apiStr += "&query=" + query;
    }
  return apiStr;
  
}

//------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------//
//Collates the majority of the api calls that can be sent on to display
class FindRecipe extends React.Component 
{
  constructor(props) 
  {
    super(props);
    this.state = 
    {
      //Async and status variables
      isLoading: false,
      error: null,
      joke: null,
      
      //Search results lists
      searchRes: [],
      searchAllergen: [],
      ingredientList: [],
      //recipes: [],
      
      //Search filter selections
      diet: null,
      cuisine: null,
      type: null,
      intolerance: null,
      query: null,
      searchIng: true
    };
    
    this.addIngredient = this.addIngredient.bind(this);
    this.removeIngredient = this.removeIngredient.bind(this);
    this.getJoke = this.getJoke.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
  }
  
  
  //Gets a joke text to fill the empty space before a search is completed
  getJoke()
  {
    this.setState({ isLoading: true });
    fetch( "https://api.spoonacular.com/food/jokes/random?" + API_KEY )
              .then(resp => resp.json() )
              .then( json => { this.setState({ joke: json.text,
                                               isLoading: false });
                                console.log(this.state.joke) 
                             } )
  }

  //Removes a selected ingredient from the ingredient list, given an index value
  removeIngredient( index )
  {
    console.log( "Index is " + Number(index));
    var newList = this.state.ingredientList;
    newList.splice(index, 1);
    this.setState({ ingredientList: newList });
  }
  
  
  //Adds an ingredient to the list, if that ingredient is not already in list
  addIngredient( selected )
  {
    if( selected.length > 0 )
    {
      console.log( "Adding ingredient " + selected[0].name );
      if( !this.state.ingredientList.includes( selected[0].name ) )
      {
        this.setState({
          ingredientList: [...this.state.ingredientList, selected[0].name ]
        })
      }
    }
  }

  
  
  
  
  //Builds a string based on the current options selected and sends request to API
  //For recipes matching that requirement
  //Search is done based on either a key word or list of ingredients
  //Trying to include both proved to be unhelpful from API experiments
  getRecipes()
  {
    //Building the string
    var apiStr =  SEARCH_URI;
    if( this.state.searchIng )
    {
      apiStr = apiIngredientList( apiStr, this.state.ingredientList);
    }
    else
    {
      apiStr = apiQuerySearch( apiStr, this.state.query );
    }
    if( this.state.diet !== "" && this.state.diet !== null && this.state.diet != "No Limits")
    {
      apiStr += "&diet=" + this.state.diet;
    }
    if( this.state.cuisine !== "" && this.state.cuisine != null)
    {
      apiStr += "&cuisine=" + this.state.cuisine;
    }
    if( this.state.type !== "" && this.state.type != null)
    {
      apiStr += "&type=" + this.state.type;
    }
    if( this.state.intolerance !== "" && this.state.intolerance != null )
    {
      apiStr += "&intolerances=" + this.state.intolerance;
    }
    
    //Making the api request, saved to recipes var in state
    this.setState({ isLoading: true });
    fetch( apiStr )
      .then( res=> res.json())
      .then(
        (result) => {
          this.props.setRecipes(result.results);
          this.setState({
            isLoading: false,
            //can change to a global loading variable
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            error
          });
        }
      )
  }


  //Async typeahead for searching ingredients fucntions
  handleInputChange = (query) => { 
    this.setState({ isLoading: true });
    fetch( addAutoComplete( query ) )
      .then(resp => resp.json() )
      .then(json => this.setState({
        isLoading: false,
        searchRes: json
    },
    (error) => {
        this.setState({
        isLoading: false,
        error});
    }))
  } 

  inputChangeDebounced = this.debounce(this.handleInputChange, 300);
  
  

  //adds a delay before calling the given function
  debounce(func, delay ) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  
//Get Recipe needs to be separated out to have a list of recipes separet from the recipe details. 
  //This is done now with shwo recipe details. This is best called from the main render to make it easier to separate components.
  render () 
  {
    if( this.state.joke === null & !this.state.isLoading )
    {
      //this.getJoke();
    }
      const space = "  ";
      const errorMsg = ["Api requests depleted"];
      return(
        
        <div className="flexmummy">
          
            <div className="flexbabysmall">
              
              <div className="radiobutton">
              
                <ButtonGroup aria-label="SearchType" >
          {/* Provides option to choose between searching by a key word or by a list of ingredients */}        
                  <Button variant="info" onClick={ ()=>this.setState({searchIng: true})}>
                    Ingredients
                  </Button>
                  
                  <Button variant="info" onClick={ ()=>this.setState({searchIng: false})}>
                    Key Word
                  </Button>
                </ButtonGroup>
                
              </div>
          {/*Search box changes based on chosen search style, either the async search with the API or any key word*/}
              <div className="label">
                <h1 className="labeltext">{ this.state.searchIng ? "Ingredient" : "Key Word" }</h1>
              </div>
              
              { this.state.searchIng ? 
              
              <ErrorBoundary>
                <AsyncTypeahead
                    isLoading={this.state.isLoading}
                    //disabled= {this.state.error !== null}
                    labelKey="name"
                    id="Ingredients"
                    placeholder="Typist ingredients"
                    clearButton="{true}"
                    emptyLabel="The cupboard is bare"
                    onInputChange={ this.inputChangeDebounced
                             }
                    options={ this.state.searchRes }
                    onChange={ (selected) => {this.addIngredient(selected)}}
                    renderMenuItemChildren={(option) => (<span>{option.name}</span>)}
                    promptText="Start typing an ingredient"
                    searchText="Looking in the pantry"
                    filterBy={() => true}
                  />
                </ErrorBoundary>
              :
              
        /*Ternary operator second option for key word search*/  
              <InputGroup>
                <Form.Control
                  placeholder="Type Here"
                  ref="input"
                  value={this.state.query}
                  clearButton="true"
                  onChange={ (selected) => this.setState({ query: selected.target.value })}
                  />
                
              </InputGroup>
              }
            
              
              <div className="label">
                <h1 className="labeltext">Dietary Limitations</h1>
              </div>
        {/*Search option of json object from the known possible dietary options in the API*/}      
                <Typeahead
                  id="dietary"
                  placeholder="Dietary Options"
                  clearButton="true"
                  options={filters.dietary}
                  onChange={ (selected) => this.setState({ diet: selected })}
                  selected={this.state.diet}
                />
              <div className="label">
                <h1 className="labeltext">Cuisine Selection</h1>
              </div>
            {/* Search option for the cuisine options, similarly using json object*/}
                  <Typeahead
                  id="cuisine"
                  placeholder="Cuisine Options"
                  clearButton="true"
                  options={filters.cuisine}
                  onChange={ (selected) => this.setState({ cuisine: selected })}
                  selected={this.state.cuisine}
                />
              
              <div className="label">
                <h1 className="labeltext">Recipe Type</h1>
              </div>
            {/* Search options for the known recipe types*/}
                  <Typeahead
                  id="type"
                  placeholder="Recipe Type"
                  clearButton="true"
                  dropup="true"
                  options={filters.type}
                  onChange={ (selected) => this.setState({ type: selected })}
                  selected={this.state.type}
                />
              
              <div className="label">
                  <h1 className="labeltext">Intolerance Selection</h1>
              </div>
              {/* Search options for the known intolerances*/}
                <Typeahead
                  id="intolerance"
                  placeholder="Intolerance Options"
                  clearButton="true"
                  dropup="true"
                  options={filters.intolerances}
                  onChange={(selected) => this.setState({ intolerance: selected })}
                  selected={this.state.intolerance}
                />
              
                    {    
                    this.state.searchIng && this.state.ingredientList.map(( ingredient, index ) => (
                          
                            <div>
          {/*Provides a cross badge for removing certain ingredients from the list*/}
                              <h4><span className="badge badge-info">
                                <svg 
                                    onClick={ event => this.removeIngredient(index) }
                                    xmlns="http://www.w3.org/2000/svg" 
                                    cursor="pointer"
                                    width="16" 
                                    height="16" 
                                    color="red"
                                    fill="currentColor" 
                                    class="bi bi-x-circle-fill" 
                                    viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>                            
                                  </svg>                  
                              {space}{ingredient}</span></h4>
                            </div>
                            
                      ))
                    }
              
              
                
                
                <div className="fullwidth">
              { /*Provides info on the search action about to be performed as a hover message*/
                  <OverlayTrigger
                    placement="right"
                    overlay={
                              <Tooltip id="Recipe">
                                {this.state.searchIng ? this.state.ingredientList.length + " ingredients to search" : "Search " + this.state.query}
                              </Tooltip>}
                  >
              {/*Button to activate search query to get recipe results*/}
                  <Button 
                    variant="primary" 
                    disabled= { this.state.isLoading} 
                    onClick={ this.getRecipes }
                  >
                      { this.state.isLoading ? "Loading..." : "Search Recipes" }
                  </Button>
                  </OverlayTrigger>
                }
                </div>
              
              </div>
        </div>
        
            );
    
  }  
}


export default FindRecipe;


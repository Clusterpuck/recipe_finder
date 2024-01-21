import React from "react";
import { ListGroup } from "react-bootstrap";
import { OverlayTrigger } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import ShowRecipeDetails from "./ShowRecipeDetails";

const NUM_RESULTS = 10;
const API_KEY = "apiKey=c1c7bd93d67a4ac98fd6346c6a3ce1d2";
const API_ENDPOINT = "https://api.spoonacular.com/";
const AUTOCOMPLETE_URI = API_ENDPOINT + "food/ingredients/autocomplete?number="+ NUM_RESULTS + "&" + API_KEY;
const RECIPE_URI = API_ENDPOINT + "recipes/";
const SEARCH_URI = API_ENDPOINT + "recipes/complexSearch?" + API_KEY;


function apiReqCard(id) 
{
    var filtStr = RECIPE_URI + id + "/card?" + API_KEY;
    return filtStr;
}


//Gets the full instructions of the chosen recipe
function apiReqInstruction(id)
{
    var filtStr = RECIPE_URI + id + "/analyzedInstructions?" + API_KEY;
    return filtStr;
}


//Gets the list of ingredients in the chosen recipe
function apiReqIngredients(id)
{
    var filtStr = RECIPE_URI + id + "/information?includeNutrition=false&" + API_KEY;
    return filtStr;
}


class GetRecipe extends React.Component
{
  constructor(props) 
  {
    super(props);
    this.state = 
    {
      //Async and error variables
      isLoading: false,
      error: null,
      
      //Recipe details variables
      recipeCard: null,
      recipeId: 0,
      instructions: null,
      ingredients: null,
      
      //String used to request more recipe details
      apiStr: ""
    };
    this.setRecipeCard = this.setRecipeCard.bind(this);
    this.apiRecipeInstructions = this.apiRecipeInstructions.bind(this);
    this.apiRecipeIngredients = this.apiRecipeIngredients.bind(this);
  }
  
  //Utilises function to request string for the api request then sends request
  //This is one part of a string of asynchronise functions using .then
  //So isloading is not set to false in this function
  setRecipeCard(index, event)
  {
    var id = this.props.recipes[index].id;
    var apiStr = apiReqCard( id );
    console.log( "Card request is " + apiStr);
    this.setState({ isLoading: true });
    fetch( apiStr )
      .then( res=> res.json())
      .then(
        (result) => {
          this.setState({
            recipeCard: result.url
          })
        },
        (error) => {
          this.setState({
            error
          });
        }
      ).then( this.apiRecipeInstructions( index, event ) );
  }
  
  //Second part of string of api requests, uses function to generate the string
  //Then sends api request to then load next function in line
  //Therefore does not set isLoading to false, instead calls the next function in .then
  apiRecipeInstructions( index, event )
  {
    var id = this.props.recipes[index].id;
    var apiStr = apiReqInstruction( id );
    this.setState({ isLoading: true });
    fetch( apiStr )
      .then( res => res.json())
      .then(
        (result) => {
          this.setState({
            instructions: result,
            recipeId: id
          });
        },
        (error) => {
          this.setState({
            error
          });
        }
      ).then( this.apiRecipeIngredients( index, event ) );
    
  }
  
  //Final api requestion in series, as other uses relevant function to generate string
  //Then performs the api request but noe sets isLoading to false
  apiRecipeIngredients( index, event )
  {
    var id = this.props.recipes[index].id;
    var apiStr = apiReqIngredients( id );
    console.log( "Instructions Request " + apiStr);
    this.setState({ isLoading: true });
    fetch( apiStr )
      .then( res=> res.json())
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            ingredients: result
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
  
    //This render displays all the recipe results if there were any, otherwise displays a joke
    //Clicking any the list items loads the series of api request to show more details
    //This is then sent as props to display the recipe in the next component
    render()
    {
      if( this.props.recipes.length === 0 )
      {
        return( 
                  <div className="flexbabybig"><h4>{this.props.joke}</h4></div>
              )
      }
      else
      {
        return(
          <>
          <div className="flexbabysmall">
            
            {/*Display the recipe results as a ListGroup */}
            
                  <ListGroup>
                {
                  this.props.recipes.map(( recipe, index ) => (
                    <div className="listitem">
                    <ListGroup.Item eventKey={index}
                      action onClick={ event => this.setRecipeCard(index, event) }
                      disabled={this.state.isLoading}
                    >
                      <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="Recipe">Show this recipe</Tooltip>}
                  >
                      <div className="listtext">{recipe.title}</div>
                      </OverlayTrigger>
                    </ListGroup.Item>
                    </div>
                    
                  ))
                }
                  </ListGroup>  
            
            </div>   
            <div className="flexbabybig">
            
              
            {/*Change this to take in just the selected recipe id, then extract
            details in the ShowRecipeDetails component */
                this.state.error === null && this.state.instructions !== null && this.state.ingredients !== null && 
                  <ShowRecipeDetails 
                    id={this.state.recipeId}
                  />
            }
            </div>
            
            </>
            
            
          

        )
      }
    }
  
    
}

export default GetRecipe;
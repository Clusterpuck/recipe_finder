import React from "react";
import { Accordion } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
//import Button from "react-bootstrap";

const API_KEY = `apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}`;
const API_ENDPOINT = "https://api.spoonacular.com/";
const RECIPE_URI = API_ENDPOINT + "recipes/";

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


function apiReqCard(id) 
{
    var filtStr = RECIPE_URI + id + "/card?" + API_KEY;
    return filtStr;
}


class ShowRecipeDetails extends React.Component
{

  

  constructor(props) 
  {
    super(props);

    this.state = {
      recipeID : props.id,
      recipeCard: null,
      instructions: null,
      ingredients: null,
    }
    this.setRecipeCard = this.setRecipeCard.bind(this);
    this.apiRecipeInstructions = this.apiRecipeInstructions.bind(this);
    this.apiRecipeIngredients = this.apiRecipeIngredients.bind(this);
  }

  componentDidMount() {
    this.setRecipeCard(this.state.recipeID);
    this.apiRecipeIngredients(this.state.recipeID);
    this.apiRecipeInstructions(this.state.recipeID);
  }

  setRecipeCard(id)
  {
    var apiStr = apiReqCard( id );
    this.setState({ isLoading: true });
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
      ).then( apiReqIngredients(id) );
  }
  
 
  
  //Final api requestion in series, as other uses relevant function to generate string
  //Then performs the api request but noe sets isLoading to false
  apiRecipeIngredients( id )
  {
    var apiStr = apiReqIngredients( id );
    this.setState({ isLoading: true });
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
      .then( apiReqInstruction(id) );
  }
  
  //Second part of string of api requests, uses function to generate the string
  //Then sends api request to then load next function in line
  //Therefore does not set isLoading to false, instead calls the next function in .then
  apiRecipeInstructions( id )
  {
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
      )
      .then( this.setState({ isLoading :false } ) );
    
  } 
  
  
  render()
  {
    
    return(
      
      this.state.loading ? "Loading Please Wait" : 

      this.state.ingredients != null &&
      this.state.instructions != null &&
      this.state.recipeCard != null &&
      
    /*Accordion displays each part of the recipe, allowing to show only each section as needed
      by default, starts with the ingredients list open*/
        <Accordion
          defaultActiveKey="0"
          flush="true">
          <Accordion.Item eventKey="0">
            
            <Accordion.Header className="fullwidth">Ingredients</Accordion.Header>
            
            <Accordion.Body className="accordion">
               <ListGroup>
                 {/*Checks if ingredients list is not null before mapping the array into list items*/}
                 <div className="listitem">
                  { this.state.ingredients != null && this.state.ingredients.extendedIngredients.map(( ingredient, index ) => (
                      <ListGroup.Item key={index}>
                       <div className="listtext">
                         {index+1}: {Math.round(ingredient.measures.metric.amount * 10)/10+" "+ingredient.measures.metric.unitLong+" of "+ingredient.name}
                       </div>
                      </ListGroup.Item>
                  ) )}
                 </div>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="1">
            <Accordion.Header>Detailed Instructions</Accordion.Header>
            <Accordion.Body className="accordion">
              {/*This checks if both instructions and steps a defined and not null before attempting to map the full list of instructions*/}
              {
                this.state.instructions[0] !== null && this.state.instructions[0] !== undefined &&
                this.state.instructions[0].steps !== undefined &&
              <>
                <label>{this.state.instructions[0].steps.map(( step, index) => ( <div><p>{index+1}: {step.step}<br></br></p></div> ) ) }</label>
                <br></br>
                {/*Provides a button that loads a secure new tab of the recipe source*/}
                <button variant="info" href={this.state.ingredients.sourceUrl} target="_blank" rel="noopener noreferrer">Go to recipe source</button>
              </>
              }
              </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Recipe Card</Accordion.Header>
            {/*Shows recipe card as provided from the API. To_DO Correct the size ratio of this image to be more reasonable*/}
            <Accordion.Body>
              { this.state.card !== null && this.state.card !== undefined &&
                <img width= "auto" height="1000vh" src={this.state.card}></img>
                }
              </Accordion.Body>
          </Accordion.Item>
        </Accordion>
    
      
      )
  }
}

export default ShowRecipeDetails;
//Standard React Components
import FindRecipe from "./components/FindRecipe";
import GetRecipe from "./components/GetRecipe";
import ShowRecipeDetails from "./components/ShowRecipeDetails";
import React, { useState } from 'react';

//Style sheet import
import 'react-bootstrap-typeahead/css/Typeahead.css';
//import './recipe.css';




//Main page to wrap and export all components
export default function RecipeSearchForm() 
{
  const [recipes, setRecipes] = useState(/* Your recipe list */);
  const [selectedRecipeId, setSelectedRecipeId] = useState(/* Default selected recipe ID */);


  return (
    <div>
    <head>
        <meta charset="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>  
        <link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"></link>
       
    </head>
      
    <body>
      <div className="banner recipebanner"><h1 className="bannertext">Find Your Recipes</h1></div>
      
      <div>
        {/*Extract components to here and centralise and pass args
        Then can easily structure framework at this point.
        send to FindRecipe the recipes list for it to set.
        Only other variable needed is the selected recipe, either id or index */}
        <FindRecipe recipes={recipes} setRecipes={setRecipes} />
        <GetRecipe recipes={recipes} selectedID={selectedRecipeId} setSelectedID={setSelectedRecipeId} />
        
      </div>
    </body>
    </div>
  );
}



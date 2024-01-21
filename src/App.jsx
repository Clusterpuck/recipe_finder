//Standard React Components
import FindRecipe from "./components/FindRecipe";

//Data source imports
//import filters from "../data/filters.json";

//Style sheet import
//import LocalStyle from "../styles/styles.css";
import 'react-bootstrap-typeahead/css/Typeahead.css';



/*Constants*/
//------------------------------------------------------------------------------------------------------------//
//Number of recipe results to show in search


//------------------------------------------------------------------------------------------------------------//
/*Functions to create URL API request strings*/

/* Functions to generate strings that search the api
  Often usede in combination to generate a long string for one request*/

/* Get requests for the API*/



//------------------------------------------------------------------------------------------------------------//


//Main page to wrap and export all components
export default function RecipeSearchForm() 
{
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
        <FindRecipe />
      </div>
    </body>
    </div>
  );
}



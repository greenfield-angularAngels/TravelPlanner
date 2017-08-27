import React from 'react';
import FoodItem from './FoodItem.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid_RestaurantList from './Grid_RestaurantList.jsx';


const FoodList = ({foodlist,handleFoodItemState}) => {

  if (foodlist.length > 0) {
    return (
      <div>
         <MuiThemeProvider>

          <Grid_RestaurantList 
            foodlist={foodlist} 
            handleFoodItemState={handleFoodItemState}
          />

        </MuiThemeProvider> 
        {/* foodlist.map((item,index) => 
        <FoodItem 
          fooditem={item} 
          key={index} 
          handleFoodItemState={handleFoodItemState}
        />)*/}
      </div>
    )
  } else {
    return (
      <h3 className = "glyphicon glyphicon-cutlery"></h3>
    )
  }

}

export default FoodList;

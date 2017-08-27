import React from 'react';
import AttractionGridItem from './AttractionGridItem.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';




function Attraction ({attrItems, handleAttrItemState}) {

  if (attrItems.length > 0) {
    return(
         <div>

           {/*
              <MuiThemeProvider>
                <AttractionGridItem
                  attrItems={attrItems}
                  handleAttrItemState={handleAttrItemState.bind(this)}
                />
              </MuiThemeProvider>
            */}


           {attrItems.map((item,index) => 
                {
                  return(
                    <MuiThemeProvider key={index}>
                      <AttractionGridItem
                        attrItem={item}
                        handleAttrItemState={handleAttrItemState.bind(this)}
                      />
                    </MuiThemeProvider> 
                  )
                }
            )}
            

         </div>
       )
  } else {
    return (
      <h3 className = 'glyphicon glyphicon-camera'></h3>
    )
  }


}

export default Attraction;

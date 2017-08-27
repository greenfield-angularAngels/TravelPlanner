import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Money from 'material-ui/svg-icons/editor/attach-money'
import Star from 'material-ui/svg-icons/toggle/star';
import ActionGrade from 'material-ui/svg-icons/action/grade';

const boxGenFile = require('../boxGenerator.js');
const makeBoxWiBoder = boxGenFile.makeBoxWiBoder;
const makeBoxWiNoBoder = boxGenFile.makeBoxWiNoBoder;


const Grid_Dollar_Sign = () => {
  return (
    <div>
      <div style={makeBoxWiNoBoder('box', '100%', '10px', 'black')} ></div>
      <div style={makeBoxWiNoBoder('box', '100%', '1px', 'black')} >
        <div style={makeBoxWiNoBoder('box', '3%', '100%', 'black')} ></div>

          <div style={makeBoxWiNoBoder('box', '94%', '100%', 'black')} >
            {['$', '$$', '$$$'].map((item) => {
              return (
                <div style={makeBoxWiNoBoder('box', '33.3333%', '100%', 'black')} >
                  <div className="dollarStyle" style={makeBoxWiNoBoder('box', '96%', '100%', 'black')} >
                    <b>{item}</b> 
                  </div>
                </div>
              )
            })}
          </div>

        <div style={makeBoxWiNoBoder('box', '3%', '100%', 'black')} ></div>
      </div>
    </div>
  )
}

export default Grid_Dollar_Sign

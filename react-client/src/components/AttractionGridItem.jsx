import React from 'react';
import classnames from 'classnames';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Star from 'material-ui/svg-icons/toggle/star';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: '95%',
    overflowY: 'auto',
  },
};

class AttractionGridItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      starColor: 'white'
    }
  }

  handleAttrClick(e){

    if (this.state.starColor === 'white') {
      this.setState({starColor:'red'})
    } else {
      this.setState({starColor:'white'})
    }

    this.setState({
      selected: !this.state.selected,
      //selectedArry: currentArr
    }, ()=>{
      this.props.handleAttrItemState( this );
    });
  }


  render(){

    return (
      <div style={styles.root} onClick = {this.handleAttrClick.bind(this)}>
        <GridList
          style={styles.gridList}
        >
          
            <GridTile
              key={'tile.img'}
              title={this.props.attrItem.name}
              subtitle={<span>by <b>{this.props.attrItem.location.display_address.join(', ')}</b></span>}
              actionIcon={
                <IconButton>
                  <Star color={this.state.starColor} />
                </IconButton>
              }
              padding={4}
            >
              <img src={this.props.attrItem.image_url} />
            </GridTile>
          
        </GridList>
      </div>
    )

    // let classes = classnames('attrBackground', {activeAttr: this.state.selected} );
    // return(
    //   <div className = {classes} id="itemBorder" onClick = {this.handleAttrClick.bind(this)} >
    //     <div><b>{this.props.attrItemEntry.name}</b></div>
    //     <div>{this.props.attrItemEntry.location.display_address.join(', ')}</div>
    //     <div>{this.props.attrItemEntry.categories[0].title}</div>
    //     <img src={this.props.attrItemEntry.image_url}  width="150" height="150"></img>
    //   </div>
    // )
  }
}

export default AttractionGridItem;

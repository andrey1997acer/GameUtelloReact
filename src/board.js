import React from 'react';
import Square from './square.js';
/**
 * @author Andre 
 * @author Andrey
 * @author Jean Carlo
 */

 /**
  * @class Board it´s the board of the game
  */
export default class Board extends React.Component {
	/**
	 * Renders the squares in the screen
	 * @param {int} i a unique index for the square 
	 */
	renderSquare(i) {
		return (
			<Square key={i} isAvailable={this.props.availableMoves.indexOf(i) > -1} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
		);
	}

	render() {
		const sizeMatriz = this.props.size;
		const rows = ['','','','','','','','']
		
		//Funcional
		rows.map((itemr,indexr)=>{
			const cols = ['','','','','','','','']
					cols.map((itemc,indexc)=>{
						cols[indexc] =  this.renderSquare(indexc + (indexr * Number(sizeMatriz)))
					})
			rows[indexr] = <div className="board-row" key={indexr}>{cols}</div>
		})

		
		
		//Imperativo
		/*for (let j = 0; j < sizeMatriz; j++) {
			const cols = [];
			for (let i = 0; i < sizeMatriz; i++) {
				cols.push(this.renderSquare(i + (j * 8)))
			}
			rows.push(<div className="board-row" key={j}>{cols}</div>);
		}*/
		return (<div className="bg bg-success">{rows}</div>);
	}
}
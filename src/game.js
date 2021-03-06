import React, { Fragment } from 'react';
import Board from './board.js';
import Ai from './ai.js';
/**
 * @author Andre 
 * @author Andrey
 * @author Jean Carlo
 */

 
export default class Game extends React.Component {

	/**
	 * Constructor and super props for pemission to all components
	 * @param {*} props 
	 * 
	 */
	constructor(props) {
		super(props);

		this.ai = new Ai(this);

		const initSquares = Array(64).fill(null);
		[initSquares[8 * 3 + 3], initSquares[8 * 3 + 4], initSquares[8 * 4 + 4], initSquares[8 * 4 + 3]] = ['X', 'O', 'X', 'O'];

		this.state = {
			history: [{
				squares: initSquares,
				xNumbers: 2,
				oNumbers: 2,
				xWasNext: true
			}],
			stepNumber: 0,
			xIsNext: true,
			blackisAi:this.props.blackisAi
			
		}
	}
	/**
	 * Check if some player win
	 * @function calculateWinner
	 * @param {Number} xNumbers 
	 * @param {Number} oNumbers 
	 */
	calculateWinner(xNumbers, oNumbers) {
		return (xNumbers + oNumbers < 64) ? null : (xNumbers === oNumbers) ? 'XO' : (xNumbers > oNumbers ? 'X' : 'O');
	}
	/**
	 * Flip the tokens/squares.
	 * @function flipSquares
	 * @param {Square} squares 
	 * @param {Number} position 
	 * @param {Boolean} xIsNext 
	 */
	flipSquares(squares, position, xIsNext) {
		let modifiedBoard = null;
		// Calculate row and col of the starting position
		let [startX, startY] = [position % 8, (position - position % 8) / 8];

		if (squares[position] !== null) {
			return null;
		}

		// Iterate all directions, these numbers are the offsets in the array to reach next sqaure
		[1, 7, 8, 9, -1, -7, -8, -9].forEach((offset) => {
			let flippedSquares = modifiedBoard ? modifiedBoard.slice() : squares.slice();
			let atLeastOneMarkIsFlipped = false;
			let [lastXpos, lastYPos] = [startX, startY];

			for (let y = position + offset; y < 64; y = y + offset) {

				// Calculate the row and col of the current square
				let [xPos, yPos] = [y % 8, (y - y % 8) / 8];

				// Fix when board is breaking into a new row or col
				if (Math.abs(lastXpos - xPos) > 1 || Math.abs(lastYPos - yPos) > 1) {
					break;
				}

				// Next square was occupied with the opposite color
				if (flippedSquares[y] === (!xIsNext ? 'X' : 'O')) {
					flippedSquares[y] = xIsNext ? 'X' : 'O';
					atLeastOneMarkIsFlipped = true;
					[lastXpos, lastYPos] = [xPos, yPos];
					continue;
				}
				// Next aquare was occupied with the same color
				else if ((flippedSquares[y] === (xIsNext ? 'X' : 'O')) && atLeastOneMarkIsFlipped) {
					flippedSquares[position] = xIsNext ? 'X' : 'O';
					modifiedBoard = flippedSquares.slice();
				}
				break;
			}
		});

		return modifiedBoard;
	}
	/**
	 * Check if the move is valid or no, if not the user cannot check that square
	 * @function checkAvailableMoves
	 * @param {*} color 
	 * @param {*} squares 
	 */
	checkAvailableMoves(color, squares) {
		return squares
			.map((value, index) => { return this.flipSquares(squares, index, color) ? index : null; })
			.filter((item) => { return item !== null; });
	}
	/**
	 * It handles all the clicks of the game
	 * @function handleClick
	 * @param {Event} i 
	 */
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[this.state.stepNumber];

		if (this.calculateWinner(current.xNumbers, current.oNumbers) || current.squares[i]) {
			return;
		}

		const changedSquares = this.flipSquares(current.squares, i, this.state.xIsNext);

		if (changedSquares === null) {
			return;
		}

		const xNumbers = changedSquares.reduce((acc, current) => { return current === 'X' ? acc + 1 : acc }, 0);
		const oNumbers = changedSquares.reduce((acc, current) => { return current === 'O' ? acc + 1 : acc }, 0);

		let shouldTurnColor = this.checkAvailableMoves(!this.state.xIsNext, changedSquares).length > 0 ? !this.state.xIsNext : this.state.xIsNext

		this.setState({
			history: history.concat([{
				squares: changedSquares,
				xNumbers: xNumbers,
				oNumbers: oNumbers,
				xWasNext: shouldTurnColor
			}]),
			stepNumber: history.length,
			xIsNext: shouldTurnColor,
		},
			this.doRobotMove);
	}
	/**
	 * Do the best move that the IA can calculate
	 * @function doRobotMove
	 */
	doRobotMove() {
		if ((this.state.blackisAi) && (!this.state.xIsNext)) {
			var bestMove = this.ai.doMove();
			if (bestMove !== null) {
				this.handleClick(bestMove);
			}
		}
	}
	/**
	 * Allow the user to go back to a specific movement made in the past
	 * @function jumpTo
	 * @param {Number} step 
	 */
	jumpTo(step) {
		this.setState({
			stepNumber: parseInt(step, 0),
			xIsNext: this.state.history[step].xWasNext
		});
	}
	/**
	 * Reset the game and all the stats
	 * @function resetGame 
	 */
	resetGame() {
		this.jumpTo(0);
		this.setState({
			history: this.state.history.slice(0, 1)
		})
	}
	/**
	 * Render the whole game into the screen.
	 */
	render() {
		const {username1,username2} = this.props;
		const history = this.state.history.slice();
		const current = history[this.state.stepNumber];

		let winner = this.calculateWinner(current.xNumbers, current.oNumbers);

		const moves = history.map((step, move) => {
			const desc = move ? 'Go to move #' + move : 'Go to game start';
			return (
				<option key={move} value={move}>
					{desc}
				</option>
			);
		});

		const selectMoves = () => {
			return (
				<select id="dropdown" ref={(input) => this.selectedMove = input} onChange={() => this.jumpTo(this.selectedMove.value)} value={this.state.stepNumber}>
					{moves}
				</select>
			)
		}

		let availableMoves = this.checkAvailableMoves(current.xWasNext, current.squares);
		let availableMovesOpposite = this.checkAvailableMoves(!current.xWasNext, current.squares);

		if ((availableMoves.length === 0) && (availableMovesOpposite.length === 0)) {
			winner = current.xNumbers === current.oNumbers ? 'XO' : current.xNumbers > current.oNumbers ? 'X' : 'O';
		}
		let status =
			winner ?
				(winner === 'XO') ? 'It\'s a draw' : 'The winner is ' + (winner === 'X' ? 'blue' : 'black') :
				[this.state.xIsNext ? 'Blues turn' : 'Blacks turn', ' with ', availableMoves.length, ' available moves.'].join('');
		return (
			<Fragment>
				<div className="game container">
				<div className="form-group col-md-12 mt-4">
                    <button className="btn btn-danger " onClick={this.props.Finish}>Quit!</button>
                    </div>
					<div className="row justify-content-center mt-5">
						<div className="form-group col-md-12 text-center">
							<h1>Game Otello in React</h1>
						</div>
						<div className="game-left-side">
							<div className="game-board col-md-12">
								<Board size={8} squares={current.squares} availableMoves={availableMoves} onClick={(i) => this.handleClick(i)} />
							</div>
							<div className="game-status form-group col-md-12"><h4>{status}&nbsp;</h4>{winner ? <button className="btn btn-info" onClick={() => this.resetGame()}>Play again</button> : ''}</div>

							<div></div>
						</div>
						<div className="game-info">

							<div><h1><strong> {username1}: Blue</strong>: {current.xNumbers}</h1></div>
							<div><h1><strong>{username2}: Black</strong>: {current.oNumbers}</h1></div>

							<br />
							<br />
							<br />
							<div><label>Select a previous move:</label></div>
							<div>{selectMoves()}</div>
							<br />
							{/*<div className="form-group col-md-12">
								<input type="checkbox" checked={this.state.blackisAi} onChange={(e) => this.setState({ blackisAi: !this.state.blackisAi })}></input>
								<h6>Make black player to a robot</h6>
		</div>:''*/}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}
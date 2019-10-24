import React, { Fragment, Component } from 'react';
import Game from './game'

/**
 * This class get values of username and type of game from player for play Utello in React
 * @class MainGame 
 */
class MainGame extends Component {
    state = {
        username1: '',
        username2: '',
        blackisAi: false,
        start: false
    }

    /**
     * Change the state from react 
     * @function changeState 
     */
    changeState = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })

    }

    /**
     * Start the game where the value start is true
     * @function Start 
     */

    Start = () => {
        this.setState({
            start: true
        })
    }
    /**
     * Start the game where the value start is false
     * @function Finish  change value Start to false in the state 
     */
    Finish = () => {
        this.setState({
            start: false
        })
    }

    render() {
        const { blackisAi, start, username1, username2 } = this.state;

        return (
            <Fragment>
                {!start ? <div className="container">
                    <div className=" row justify-content-center">

                    <div className="form-group col-md-12  text-center">
                                <h1>Main Menu Game Utello</h1>
                            </div>
                            <div className="form-group col-md-12 text-center">
                            <h3 for="exampleFormControlSelect1" >Type Game:</h3>
                            
                            <div className="form-group col-md-12">
								<input type="checkbox" checked={this.state.blackisAi} onChange={(e) => this.setState({ blackisAi: !this.state.blackisAi })}></input>
								<h6 className="text-info">Make black player to a robot</h6>
		                    </div>
                            </div>
                            

                           


                            <div className="form-row col-md-6 ">
                                <label>Username 1:</label>
                                <input type="text" className="form-control" name="username1" onChange={this.changeState} />
                            </div>
                            <div className="form-row col-md-6 ">
                                <label>User name 2:</label>
                                <input type="text" className="form-control" name="username2" onChange={this.changeState} />
                            </div>

                        </div>
                        <div className="form-group col-md-12 mt-4 text-center">
                            <button className="btn btn-danger " onClick={this.Start}>Go!</button>
                        </div>

                    </div> :
                <Game
                        Finish={this.Finish}
                        blackisAi={blackisAi}
                        username1={username1}
                        username2={username2}
                    />
                    }
                                    
                                    
                    
                                    
            </Fragment>
        );
            }
        }
        
export default MainGame;
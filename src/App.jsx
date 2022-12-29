import React, { useEffect, useReducer } from 'react';
import './App.css';
import Tile from './components/Tile';
import { emojis } from '../public/emojis';

const randomArray = () => {
	return [...Array(12).keys()].sort((a, b) => 0.5 - Math.random());
};

function App() {
	const initialState = {
		count: 0,
		numberToGuess: 6,
		tiles: randomArray().map((x, index) => {
			return {
				id: index,
				value: Math.floor(x / 2),
				visible: false,
				guessed: false,
			};
		}),
		firstTile: null,
		secondTile: null,
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'clicked':
				if (state.count < 2) {
					return {
						...state,
						count: state.count + 1,
						tiles: state.tiles.map((item) => {
							if (item.id === action.payload) {
								return {
									...item,
									visible: true,
								};
							} else {
								return item;
							}
						}),
						firstTile:
							state.count === 0
								? state.tiles.find((item) => item.id === action.payload).value
								: state.firstTile,
						secondTile:
							state.count === 1
								? state.tiles.find((item) => item.id === action.payload).value
								: state.secondTile,
					};
				} else {
					return state;
				}
			case 'guess':
				return {
					...state,
					count: 0,
					numberToGuess: state.numberToGuess - 1,
					tiles: state.tiles.map((item) => {
						if (item.value === state.firstTile || item.value === state.secondTile) {
							return {
								...item,
								guessed: true,
							};
						} else {
							return item;
						}
					}),
				};
			case 'afterGuess':
				return {
					...state,
					tiles: state.tiles.map((item) => {
						return {
							...item,
							visible: false,
						};
					}),
					firstTile: null,
					secondTile: null,
				};
			case 'reset':
				return {
					...state,
					count: 0,
					tiles: state.tiles.map((item) => {
						return {
							...item,
							visible: false,
						};
					}),
					firstTile: null,
					secondTile: null,
				};
			case 'playAgain':
				return {
					count: 0,
					numberToGuess: 6,
					tiles: randomArray().map((x, index) => {
						return {
							id: index,
							value: Math.floor(x / 2),
							visible: false,
							guessed: false,
						};
					}),
					firstTile: null,
					secondTile: null,
				};
			default:
				throw new Error();
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState);
	const gameDone = state.numberToGuess === 0;

	useEffect(() => {
		if (state.count === 2) {
			const timeout = setTimeout(() => {
				if (state.firstTile === state.secondTile) {
					dispatch({ type: 'guess' });
				} else {
					dispatch({ type: 'reset' });
				}
			}, 1000);

			return () => clearTimeout(timeout);
		}
	}, [state, dispatch]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			dispatch({ type: 'afterGuess' });
		}, 601);

		return () => clearTimeout(timeout);
	}, [state.numberToGuess]);

	const playAgainHandler = () => {
		dispatch({ type: 'playAgain' });
	};

	return (
		<div className="App">
			{gameDone && (
				<div className="play-again">
					<h2 className="play-again-msg">Congrats!!!</h2>
					<button className="play-again-btn" onClick={playAgainHandler}>
						Play again?
					</button>
				</div>
			)}
			<div className="layout">
				{state.tiles.map((item) => (
					<Tile
						key={item.id}
						id={item.id}
						visible={item.visible}
						guessed={item.guessed}
						dispatch={dispatch}
					>
						{emojis[item.value]}
					</Tile>
				))}
			</div>
		</div>
	);
}

export default App;

import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Tile.css';

function Tile({ children, id, visible, guessed, dispatch }) {
	const onClickHandler = () => {
		if (!visible) {
			dispatch({ type: 'clicked', payload: id });
		}
	};

	const nodeRef = useRef(null);

	return (
		<div className="tile-container">
			<CSSTransition nodeRef={nodeRef} in={visible} timeout={333} classNames="flip">
				<div className={`tile ${guessed ? 'hidden' : ''}`} onClick={onClickHandler} ref={nodeRef}>
					<div className="tile-back"></div>
					<div className="tile-front">{children}</div>
				</div>
			</CSSTransition>
		</div>
	);
}

export default Tile;

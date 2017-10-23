import React, { Component } from 'react';
import update from 'immutability-helper';
import NextCard from '../components/NextCard';
import Interface from '../components/Interface';
import Status from '../components/Status';
import Foundation from '../components/Foundation';
import Target from '../components/Target';


class App extends Component {
  constructor() {
    super();
    const deck = shuffle(deckValues.slice());
    this.state = {
      deck: deck,
      nextCard: deck.shift(),
      foundations: Array(4).fill([]),
      targets: Array(4).fill(null),
      focusedFoundation: null,
      nextCardFocused: true,
      lastMove: null
    };
  }

  render() {
    const foundationComponents = [];
    const targetComponents = [];
    for (let i = 0; i < 4; i++) {
      const foundationCards = this.state.foundations[i];
      foundationComponents.push(
          <Foundation
            cards={foundationCards}
            onFocus={() => this.onFoundationFocus(i)}
            autofocus={this.state.focusedFoundation === i}
          />
      );
      targetComponents.push(
        <Target
          i={i}
          topCard={this.state.targets[i]}
        />
      );
    }

    const divStyle = {
      maxWidth: "800px"
    };

    return (
      <div style={{margin: "auto", maxWidth: "800px"}} onKeyPress={(e) => this.onKeyPress(e)}>
        <div>
          <div style={{display: "inline-block"}}>
            <NextCard cardObj={this.state.nextCard} onFocus={() => this.onNextCardFocus()} autofocus={this.state.nextCardFocused}/>
          </div>
          <div style={{paddingLeft: "10px", display: "inline-block"}}>
            <h3>CALCULATION SOLITARE</h3>
            <ul>
            <li>Each foundation ignores suit and increments by either 1, 2, 3, or 4, all ending in K.</li>
            <li>Tableaus can be stacked arbitrarily.</li>
            <li>`,1,2,3,4 keys adjust focus between next card and the 4 tableaus.</li>
            <li>Q,W,E,R send the next card to the corresponding tableau, if the next card is selected.</li>
            <li>A,S,D,F sends the focused card to the corresponding foundation, if legal.</li>
            <li>Use each foundation's progress tracker to see what card it requires next.</li>
            </ul>
            Good luck!
          </div>
        </div>
        <Status deckSize={this.state.deck.length} victory={this.isWin()}/>
        <div style={divStyle}>
          {foundationComponents}
        </div>
        <Interface
            onFoundationClick={(i) => this.onFoundationClick(i)}
            onTargetClick={(i) => this.onTargetClick(i)}
            onUndoClick={() => this.onUndoClick()}
            onResetClick={() => this.onResetClick()}
            foundationsDisabled={!(this.state.nextCardFocused && this.state.nextCard)}
            disabledStatuses={[0,1,2,3].map((i) => !this.canSendToTarget(i))}
            undoDisabled={this.state.lastMove === null}
        />
        <div style={divStyle}>
          {targetComponents}
        </div>
      </div>
    );
  }

  onKeyPress(e) {
    if (e.key === '`') {
      this.setState({
        focusedFoundation: null,
        nextCardFocused: true
      });
    } else if (['1','2','3','4'].includes(e.key)) {
      this.setState({
        focusedFoundation: parseInt(e.key, 10) - 1,
        nextCardFocused: false
      });
    } else if (this.state.nextCardFocused && ['q', 'w', 'e', 'r'].includes(e.key)) {
      this.onFoundationClick({ q: 0, w: 1, e: 2, r: 3 }[e.key]);
    } else if (['a', 's', 'd', 'f'].includes(e.key)) {
      const targetNum = { a: 0, s: 1, d: 2, f: 3}[e.key];
      if (this.canSendToTarget(targetNum)) {
        this.onTargetClick(targetNum);
      }
    }
  }

  isWin() {
    for (let i = 0; i < this.state.targets.length; i++) {
      const target = this.state.targets[i];
      if (!target || target.v < 13) {
        return false;
      }
    }

    return true;
  }

  onFoundationFocus(i) {
    this.setState({
        nextCardFocused: false,
        focusedFoundation: i
    });
  }

  onNextCardFocus() {
    this.setState({
        nextCardFocused: true,
        focusedFoundation: null
    });
  }

  onFoundationClick(i) {
    if (!this.state.nextCardFocused) {
      return;
    }

    const deck = this.state.deck.slice();
    const nextCard = deck.shift();
    const foundations = update(this.state.foundations, {[i]: {$push: [ this.state.nextCard ]}});
    
    this.setState({
        deck: deck,
        nextCard: nextCard,
        foundations: foundations,
        lastMove: {
          deck: this.state.deck,
          nextCard: this.state.nextCard,
          foundations: this.state.foundations,
          targets: this.state.targets,
        }
    });
  }

  onTargetClick(i) {
    if (!this.canSendToTarget(i)) {
      return;
    }

    const targets = update(this.state.targets, {[i]: {$set: this.focusedCard()}});
    const stateChange = {
      targets: targets,
      lastMove: {
        deck: this.state.deck,
        nextCard: this.state.nextCard,
        foundations: this.state.foundations,
        targets: this.state.targets,
      }
    };
    if (this.state.nextCardFocused) {
      const deck = this.state.deck.slice();
      const nextCard = deck.shift();

      stateChange["deck"] = deck;
      stateChange["nextCard"] = nextCard;
    } else {
      const foundationLength = this.state.foundations[this.state.focusedFoundation].length - 1
      const foundations = update(this.state.foundations, {[this.state.focusedFoundation]: {$splice: [[foundationLength]]}});
      stateChange["foundations"] = foundations;
      if (foundationLength === 0) {
        stateChange["nextCardFocused"] = true;
        stateChange["focusedFoundation"] = null;
      }
    }

    stateChange["targets"] = targets;

    this.setState(stateChange);
  }

  onUndoClick() {
    if (this.state.lastMove === null) {
      return;
    }

    this.setState({
      deck: this.state.lastMove.deck,
      nextCard: this.state.lastMove.nextCard,
      foundations: this.state.lastMove.foundations,
      targets: this.state.lastMove.targets,
      focusedFoundation: null,
      nextCardFocused: true,
      lastMove: null
    });
  }

  onResetClick() {
    const deck = shuffle(deckValues.slice());
    this.setState({
      deck: deck,
      nextCard: deck.shift(),
      foundations: Array(4).fill([]),
      targets: Array(4).fill(null),
      focusedFoundation: null,
      nextCardFocused: true,
      lastMove: {
        deck: this.state.deck,
        nextCard: this.state.nextCard,
        foundations: this.state.foundations,
        targets: this.state.targets,
      }
    });
  }

  canSendToTarget(i) {
    const card = this.focusedCard();
    if (!card) {
      return false;
    }

    const targetValue = this.state.targets[i] ? this.state.targets[i].v : 0;
    return (targetValue < 13) && (card.v % 13 === (targetValue + (i + 1)) % 13);
  }

  focusedCard() {
    if (this.state.nextCardFocused) {
      return this.state.nextCard;
    }

    const foundation = this.state.foundations[this.state.focusedFoundation];
    return foundation[foundation.length-1];
  }
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

const deckValues = Object.freeze([
        {v:1,f:"ca"},{v:2,f:"c2"},{v:3,f:"c3"},{v:4,f:"c4"},{v:5,f:"c5"},{v:6,f:"c6"},
        {v:7,f:"c7"},{v:8,f:"c8"},{v:9,f:"c9"},{v:10,f:"c10"},{v:11,f:"cj"},{v:12,f:"cq"},{v:13,f:"ck"},
        {v:1,f:"ha"},{v:2,f:"h2"},{v:3,f:"h3"},{v:4,f:"h4"},{v:5,f:"h5"},{v:6,f:"h6"},
        {v:7,f:"h7"},{v:8,f:"h8"},{v:9,f:"h9"},{v:10,f:"h10"},{v:11,f:"hj"},{v:12,f:"hq"},{v:13,f:"hk"},
        {v:1,f:"sa"},{v:2,f:"s2"},{v:3,f:"s3"},{v:4,f:"s4"},{v:5,f:"s5"},{v:6,f:"s6"},
        {v:7,f:"s7"},{v:8,f:"s8"},{v:9,f:"s9"},{v:10,f:"s10"},{v:11,f:"sj"},{v:12,f:"sq"},{v:13,f:"sk"},
        {v:1,f:"da"},{v:2,f:"d2"},{v:3,f:"d3"},{v:4,f:"d4"},{v:5,f:"d5"},{v:6,f:"d6"},
        {v:7,f:"d7"},{v:8,f:"d8"},{v:9,f:"d9"},{v:10,f:"d10"},{v:11,f:"dj"},{v:12,f:"dq"},{v:13,f:"dk"}
]);

export default App;

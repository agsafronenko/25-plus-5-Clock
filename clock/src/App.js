import React from "react";
import styles from "./styles/styles.css";
import beep from "./timeIsUp.wav";

let interval = null;

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 300,
      session: 1500,
      timeLeft: 1500,
      status: "session",
      pause: "on",
    };
    this.handleBreakLength = this.handleBreakLength.bind(this);
    this.handleSessionLength = this.handleSessionLength.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.start_stop = this.start_stop.bind(this);
  }

  handleBreakLength(e) {
    this.setState(
      (state) => ({
        break: e.target.id === "break-decrement" ? (state.break < 61 ? 60 : state.break - 60) : state.break > 3540 ? 3600 : state.break + 60,
      }),
      () =>
        this.setState((state) => ({
          timeLeft: state.status === "break" ? state.break : state.timeLeft,
        }))
    );
  }
  handleSessionLength(e) {
    this.setState(
      (state) => ({
        session: e.target.id === "session-decrement" ? (state.session < 61 ? 60 : state.session - 60) : state.session > 3540 ? 3600 : state.session + 60,
      }),
      () =>
        this.setState((state) => ({
          timeLeft: state.status === "session" ? state.session : state.timeLeft,
        }))
    );
  }

  start_stop() {
    // document.getElementById("beep").play();
    if (this.state.pause === "on") {
      this.setState({
        pause: "off",
      });
      interval = setInterval(() => {
        this.setState((state) => ({
          timeLeft: state.timeLeft - 1,
        }));
      }, 1000);
    } else {
      this.setState({
        pause: "on",
      });
      clearInterval(interval);
    }
  }

  handleReset() {
    clearInterval(interval);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    this.setState({
      break: 300,
      session: 1500,
      timeLeft: 1500,
      status: "session",
      pause: "on",
    });
  }
  render() {
    if (this.state.status === "session" && this.state.timeLeft < 0) {
      document.getElementById("beep").play();
      this.setState((state) => ({
        status: "break",
        timeLeft: state.break,
      }));
    }
    if (this.state.status === "break" && this.state.timeLeft < 0) {
      document.getElementById("beep").play();
      this.setState((state) => ({
        status: "session",
        timeLeft: state.session,
      }));
    }
    return (
      <div id="clock-box">
        <h2 id="title">25 + 5 Clock</h2>
        <div id="length-boxes">
          <Break handleBreakLength={this.handleBreakLength} breakLength={this.state.break} />
          <Session handleSessionLength={this.handleSessionLength} sessionLength={this.state.session} />
        </div>
        <Timer status={this.state.status} reset={this.handleReset} start_stop={this.start_stop} timeLeft={this.state.timeLeft} />
      </div>
    );
  }
}

class Break extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="length-box">
        <div id="break-label">Break Length</div>
        <div className="length-controls">
          <button id="break-decrement" onClick={this.props.handleBreakLength}>
            -
          </button>
          <div id="break-length">{this.props.breakLength / 60}</div>
          <button id="break-increment" onClick={this.props.handleBreakLength}>
            +
          </button>
        </div>
      </div>
    );
  }
}

class Session extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="length-box">
        <div id="session-label">Session Length</div>
        <div className="length-controls">
          <button id="session-decrement" onClick={this.props.handleSessionLength}>
            -
          </button>
          <div id="session-length">{this.props.sessionLength / 60}</div>
          <button id="session-increment" onClick={this.props.handleSessionLength}>
            +
          </button>
        </div>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let minutes = Math.floor(this.props.timeLeft / 60);
    let seconds = Math.floor(this.props.timeLeft % 60);
    let timeLeftMMSS = "" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    return (
      <div id="timer">
        <div id="timer-label">{this.props.status}</div>
        <div id="time-left">{timeLeftMMSS}</div>
        <button id="start_stop" onClick={this.props.start_stop}>
          start-stop
        </button>
        <button id="reset" onClick={this.props.reset}>
          reset
        </button>
        <audio id="beep" src={beep} type="audio/wav"></audio>
      </div>
    );
  }
}

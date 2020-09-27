import React from 'react'
import axios from 'axios'
import { withCookies, Cookies } from 'react-cookie'
import Button from 'react-bootstrap/Button'
import Loader from 'react-loader'
import Slider from 'react-rangeslider'

const CHATAREA = {
	boxSizing: 'border-box',
	paddingRight: '0px',
	paddingLeft: '0px',
	margin: '0px auto',
	backgroundColor: 'white',
	border: '1px solid rgb(230, 230, 230)',
	height: 'calc(100% - 60px)',
	display: 'flex',
	flexDirection: 'column',
	width: '832px'
}

const CONVERSATIONAREA = {
	flex: '1 1 0%',
	paddingLeft: '40px',
	paddingRight: '40px',
	overflow: 'hidden scroll'
}

const CHATBOX = {
	boxSizing: 'border-box',
	alignSelf: 'flex-start',
	backgroundColor: 'rgb(228, 228, 228)',
	display: 'inline-block',
	padding: '0.625rem 1rem',
	marginBottom: '0.236rem',
	borderRadius: '0.25rem 1.375rem 1.375rem 0.25rem',
	wordBreak: 'break-word'
}

const CHATBOXRIGHT = {
	boxSizing: 'border-box',
	alignSelf: 'flex-end',
	backgroundColor: 'rgb(228, 228, 228)',
	display: 'inline-block',
	padding: '0.625rem 1rem',
	marginBottom: '0.236rem',
	borderRadius: '0.25rem 1.375rem 1.375rem 0.25rem',
	wordBreak: 'break-word'
}

const TEXT = {
	boxSizing: 'border-box',
	fontSize: '1em',
	fontWeight: '400', 
	margin: '0px',
	letterSpacing: '0.7px',
	lineHeight: '1.5'
}

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			chats: [],
			loading: true,
			user: null,
			error: null,
			session: null,
			name: null,
			age: null,
			next: null,
			textVal: "",
			rangeVal: 1
		}
		this.getAge = this.getAge.bind(this)
		this.getName = this.getName.bind(this)
		this.saveNameAndAge = this.saveNameAndAge.bind(this)
		this.next = this.next.bind(this)
		this.handleUserInput = this.handleUserInput.bind(this)
	}
	componentDidMount() {
		this.fetchUserInformation()
	}
	fetchUserInformation() {
		const { cookies } = this.props
		let user = cookies.get('user')
		if (user) {
			this.start(user)
		} else {
			this.getName()
		}
	}
	start(user_id) {
		const { chats } = this.state
		const { cookies } = this.props
		axios.post('/api/start', {
			user_id: user_id
		})
			.then(res => {
				console.log(res)
				let newChats = [...chats]
				res.data.messages.forEach(message => {
					newChats.push({
						type: 'bot',
						message: message,
						next: res.data.next,
						range: res.data.range,
					})
				})
				cookies.set('user', res.data.user_id)
				this.setState({user: res.data.user_id, loading: false, chats: newChats, age: res.data.age})
			})
			.catch(res => {
				console.log(res)
				this.setState({error: true, loading: false})
			})

	}
	getName() {
		const { chats } = this.state
		let nextChats = [
			{type: 'bot', message: 'Hi, to get started let us know your name and age :)'},
			{type: 'bot', message: 'Please enter your name', next: 'getAge', _key: 'name'}
		]
		this.setState({chats: nextChats, loading: false})
	}
	getAge() {
		const { chats } = this.state
		let nextChats = [...chats]
		let name = chats[chats.length - 1].message
		nextChats.push({
			type: 'bot',
			message: 'Please enter your age',
			next: 'saveNameAndAge',
			_key: 'age'
		})
		this.setState({chats: nextChats, loading: false, name: name})
	}
	saveNameAndAge() {
		const { user, chats, name } = this.state
		const { cookies } = this.props
		let age = chats[chats.length - 1].message
		axios.post('/api/start', {
			name: name,
			age: age,
			user_id: user
		})
			.then(res => {
				console.log(res)
				let newChats = [...chats]
				res.data.messages.forEach(message => {
					newChats.push({
						type: 'bot',
						message: message,
						next: res.data.next,
						range: res.data.range,
					})
				})
				cookies.set('user', res.data.user_id)
				this.setState({user: res.data.user_id, loading: false, chats: newChats, age: res.data.age})
			})
			.catch(res => {
				console.log(res)
				this.setState({error: true, loading: false})
			})
	}
	fork() {
		const { user, chats, name } = this.state
		const { cookies } = this.props
		let ans = chats[chats.length - 1].message
		axios.post('/api/fork', {
			name: name,
			answer: ans,
			user_id: user
		})
			.then(res => {
				console.log(res)
				let newChats = [...chats]
				res.data.messages.forEach(message => {
					newChats.push({
						type: 'bot',
						message: message,
						next: res.data.next,
						range: res.data.range,
					})
				})
				this.setState({loading: false, chats: newChats})
			})
			.catch(res => {
				console.log(res)
				this.setState({error: true, loading: false})
			})
	}
	path1() {
		const { user, chats, name } = this.state
		const { cookies } = this.props
		let ans = chats[chats.length - 1].message
		axios.post('/api/path1', {
			name: name,
			answer: ans,
			user_id: user
		})
			.then(res => {
				console.log(res)
				let newChats = [...chats]
				res.data.messages.forEach(message => {
					newChats.push({
						type: 'bot',
						message: message,
						next: res.data.next,
						range: res.data.range,
						end: res.data.end
					})
				})
				this.setState({loading: false, chats: newChats})
			})
			.catch(res => {
				console.log(res)
				this.setState({error: true, loading: false})
			})

	}
	path2() {
		const { user, chats, name } = this.state
		const { cookies } = this.props
		let ans = chats[chats.length - 1].message
		axios.post('/api/path2', {
			name: name,
			answer: ans,
			user_id: user
		})
			.then(res => {
				console.log(res)
				let newChats = [...chats]
				res.data.messages.forEach(message => {
					newChats.push({
						type: 'bot',
						message: message,
						next: res.data.next,
						range: res.data.range,
						timer: res.data.timer
					})
				})
				this.setState({loading: false, chats: newChats})
			})
			.catch(res => {
				console.log(res)
				this.setState({error: true, loading: false})
			})

	}
	next() {
		const { chats } = this.state
		console.log(chats)
		let key = chats[chats.length - 2].next
		console.log(key)
		if (key === 'getAge') {
			this.getAge()
		} else if (key === 'saveNameAndAge') {
			this.saveNameAndAge()
		} else if (key === 'fork') {
			this.fork()
		} else if (key === 'path1') {
			this.path1()
		} else if (key === 'path2') {
			this.path2()
		}
		// TODO
	}
	handleUserInput(message, field) {
		const { chats } = this.state
		let newChats = [...chats]
		if (field === 'text') {
			newChats.push({type: 'user', message: message})
		} else if (field === 'range') {
			newChats.push({type: 'user', message: message})
		} else if (field === 'select') {
			// TODO
		}
		this.setState({
			chats: newChats,
			loading: true,
			textVal: "",
			rangeVal: 0
		}, this.next)
	}
	populateChats() {
		const { chats } = this.state
		let res = []
		chats.forEach((chat, i) => {
			if (chat.type === 'bot') {
				res.push(<BotBox message={chat.message} key={i}/>)
				if (chat.timer) {
					res.push(<TimerBox key={`${i}-{timer}`} />)
				}
			} else {
				res.push(<UserBox message={chat.message} key={i}/>)
			}
		})
		return res
	}
	populateInput() {
		const { chats, rangeVal, textVal } = this.state
		let lastChat = chats[chats.length - 1]
		if (lastChat.type === "bot") {
			if (lastChat.range) {
				return <RangeInput
					submit={this.handleUserInput}
					value={rangeVal}
				/>
			} else if (lastChat.timer) {
				return <Timer />
			} else {
				return <TextInput
					submit={this.handleUserInput}
					value={textVal}
				/>
			}
		} else {
			return <TextInput
				onUpdate={this.handleUserInput}
				disabled={true}
				value={""}
			/>
		}
	}
	render() {
		console.log('main', this.state)
		const { chats, loading } = this.state
		if (loading) {
			return <Loader />
		} else if (chats.length > 0) {
			return <div style={{display: 'block'}}>
				<div style={{height: '100%'}}>
					<div style={CHATAREA}>
						<div style={CONVERSATIONAREA}>
							{ this.populateChats() }
						</div>
					</div>
					<div className="fixed">
						<div className="box">
							<footer>
								<div className="flex-out">
									<div className="flex-in">
										{ this.populateInput() }
									</div>
								</div>
							</footer>
						</div>
					</div>
				</div>
			</div>
		} else {
			return <div> Error </div>
		}
	}
}

class BotBox extends React.PureComponent {
	render() {
		const { message } = this.props
		return <div>
			<div style={CHATBOX}>
				<p style={TEXT}>
					{message}
				</p>
			</div>
		</div>
	}
}

const CHATUSERRIGHT = {
	boxSizing: 'border-box',
	alignSelf: 'flex-end',
	backgroundColor: 'rgb(0, 91, 187)',
	display: 'inline-block',
	padding: '0.618rem 1rem',
	marginBottom: '0.236rem',
	borderRadius: '1.375rem 1.375rem 0.25rem',
	wordBreak: 'break-word'
}

class UserBox extends React.PureComponent {
	render() {
		const { message } = this.props
		return <div>
				<div style={CHATUSERRIGHT}>
				<p style={TEXT}>
					{message}
				</p>
				</div>
			</div>
	}
}

class TextInput extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {value: props.value}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	handleChange(e) {
		this.setState({value: e.target.value})
	}
	handleSubmit(e) {
		e.preventDefault()
		const { submit } = this.props
		const { value } = this.state
		submit(value, 'text')
	}
	render() {
		const { value } = this.state
		const { disabled } = this.props
		return <React.Fragment>
			<div className="flex-box">
				<input
					className="flex-input"
					type="text"
					onChange={this.handleChange}
					value={value}
					disabled={disabled}
					placeholder="Type a message here"
				/>
			</div>
			<span></span>
			<Button
				className="send-button"
				variant="primary"
				onClick={this.handleSubmit}
				disabled={disabled}
			>
				Submit
			</Button>
		</React.Fragment>
	}
}

class RangeInput extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {value: props.value}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	handleChange(value) {
		this.setState({value: value})
	}
	handleSubmit(e) {
		e.preventDefault()
		const { value } = this.state
		const { submit } = this.props
		submit(value, 'range')
	}
	render() {
		const { value } = this.state
		return <div>
			<Slider
        value={value}
				min={1}
				max={10}
        orientation="horizontal"
        onChange={this.handleChange}
      />
			<div
				className="send-button"
				variant="primary"
				onClick={this.handleSubmit}
			>
				Submit
			</div>
		</div>
	}
}

class Timer extends React.Component {
	render() {
		return <div>
		</div>
	}
}

export default withCookies(App)

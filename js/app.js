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
	borderLeft: '1px solid rgb(230, 230, 230)',
	borderRight: '1px solid rgb(230, 230, 230)',
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
		nextChats.push({
			type: 'bot',
			message: 'Please enter your age',
			next: 'saveNameAndAge',
			_key: 'age'
		})
		this.setState({chats: nextChats, loading: false})
	}
	saveNameAndAge() {
		const { chats } = this.state
		const { cookies } = this.props
		axios.post('/api/start')
			.then(res => {
				let user = res.data.user
				let newChats = [...chats]
				newChats.append({
					type: 'bot',
					message: message,
					next: res.data.next,
					range: res.data.range,
				})
				cookies.set('user', user.id)
				this.setState({user: user, loading: false, chats: newChats})
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
		return chats.map((chat, i) => {
			if (chat.type === 'bot') {
				return <BotBox message={chat.message} key={i}/>
			} else {
				return <UserBox message={chat.message} key={i}/>
			}
		})
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
						<div>
							{ this.populateInput() }
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

class UserBox extends React.PureComponent {
	render() {
		const { message } = this.props
		return <div style={CHATBOX}>
			<p style={TEXT}>
				{message}
			</p>
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
		return <div>
			<input
				type="text"
				onChange={this.handleChange}
				value={value}
				disabled={disabled}
			/>
			<Button
				variant="primary"
				onClick={this.handleSubmit}
				disabled={disabled}
			>
				Submit
			</Button>
		</div>
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
			<Button
				variant="primary"
				onClick={this.handleSubmit}
			>
				Submit
			</Button>
		</div>
	}
}

export default withCookies(App)

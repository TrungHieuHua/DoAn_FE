import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import styles from './Chatbot.module.scss';

const cx = classNames.bind(styles);

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: "Xin chào! Chào mừng bạn đã đến với cửa hàng của chúng tôi!! Tôi có thể giúp gì cho bạn?",
            isBot: true,
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [sessionId] = useState(uuidv4());
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            text: inputMessage,
            isBot: false,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            // Call Dialogflow API
            const response = await axios.post('http://localhost:8080/api/chatbot', {
                message: inputMessage,
                sessionId: sessionId
            });

            const botResponse = {
                text: response.data.text,
                isBot: true,
            };

            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error('Error sending message to Dialogflow:', error);
            const errorMessage = {
                text: "Xin lỗi, hiện tại tôi đang gặp sự cố. Vui lòng thử lại sau.",
                isBot: true,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={cx('chatbot-container')}>
            {!isOpen ? (
                <button className={cx('chat-button')} onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faRobot} />
                </button>
            ) : (
                <div className={cx('chat-window')}>
                    <div className={cx('chat-header')}>
                        <h3>Chat Bot</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className={cx('messages-container')}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cx('message', {
                                    'bot-message': message.isBot,
                                    'user-message': !message.isBot,
                                })}
                            >
                                <FontAwesomeIcon 
                                    icon={message.isBot ? faRobot : faUser} 
                                    className={cx('message-icon')}
                                />
                                <p>{message.text}</p>
                            </div>
                        ))}
                        {isTyping && (
                            <div className={cx('message', 'bot-message', 'typing')}>
                                <FontAwesomeIcon icon={faRobot} className={cx('message-icon')} />
                                <div className={cx('typing-indicator')}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className={cx('input-container')}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            disabled={isTyping}
                        />
                        <button type="submit" disabled={isTyping}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot; 
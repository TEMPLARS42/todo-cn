import { useState } from 'react';
import { Plus, LogIn, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function LandingPage({ }) {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (roomId.trim()) {
            navigate(`/todos/${roomId}`);
        }
    };

    const handleCreateRoom = () => {
        const generatedId = uuidv4(); // Create a new UUID
        navigate(`/todos/${generatedId}`);
    }

    return (
        <div className="landing-container min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <h1 className="display-4 fw-bold text-white mb-4">
                            Collaborative Todo Lists
                            <span className="text-primary"> Made Simple</span>
                        </h1>
                        <p className="lead text-light mb-5">
                            Create and manage todos together in real-time. Share your workspace
                            with team members and stay organized.
                        </p>
                        <div className="d-flex gap-3 mb-5">
                            <button
                                type='button'
                                onClick={handleCreateRoom}
                                className="btn btn-primary btn-lg d-flex align-items-center gap-2"
                            >
                                <Plus size={24} />
                                New Room
                            </button>
                            <form onSubmit={handleJoinRoom} className="d-flex gap-2 flex-grow-1">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Enter room code"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-outline-primary btn-lg d-flex align-items-center gap-2"
                                >
                                    <LogIn size={24} />
                                    Join
                                </button>
                            </form>
                        </div>
                        <div className="features d-flex gap-4">
                            <div className="feature-item">
                                <div className="feature-icon mb-3">
                                    <MessageSquare size={32} className="text-primary" />
                                </div>
                                <h5 className="text-white">Real-time Collaboration</h5>
                                <p className="text-light">Work together with your team in real-time</p>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon mb-3">
                                    <Plus size={32} className="text-primary" />
                                </div>
                                <h5 className="text-white">Quick Setup</h5>
                                <p className="text-light">Create a room and start organizing instantly</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="landing-image">
                            <img
                                src="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=232&q=80"
                                alt="Collaborative Todo"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import Logo from '../../assets/logo.svg';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2, FiPlus, FiEdit2 } from 'react-icons/fi';

import './styles.css';

const Profile = () => {
    const [tasks, setTasks] = useState([]);

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    const history = useHistory();

    useEffect(() => {
        api.get('tasks', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            setTasks(response.data.result);
        })
    }, [token]);

    function completed(bool) {
        if (bool) {
            return 'SIM';
        }
        return 'NÃO';
    }

    async function handleLogout() {
        try {
            api.put('logout', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            history.push('/login')
        }
        catch (err) {
            alert('Erro ao fazer logout, tente novamente.');
        }
    }

    async function handleDeleteTask(id) {
        try {
            await api.delete(`tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setTasks(tasks.filter(task => task.id !== id));
        }
        catch (err) {
            alert('Erro ao deletar tarefa, tente novamente.');
        }
    }

    return (
        <div className="profile-container">
            <header>
                <img src={Logo} alt="Tasks"/>
                <span>Bem vindo(a), {userName}</span>

                <div>
                    <Link className="button" to="/CreateTask">Cadastrar nova tarefa</Link>
                    <FiPlus size={16} color="6904A7" />
                </div>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#6904A7" />
                </button>

            </header>

            <h1>Tarefas criadas</h1>

            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <strong>NOME:</strong>
                        <p>{task.name}</p>

                        <strong>PRIORIDADE:</strong>
                        <p>{task.priority}</p>

                        <strong>COMPLETA:</strong>
                        <p>{completed(task.completed)}</p>

                        <button onClick={() => handleDeleteTask(task.id)} type="button">
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Profile;
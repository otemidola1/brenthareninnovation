import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Trash2, CheckCircle } from 'lucide-react';

const MyCards = () => {
    const { user } = useAuth();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newCard, setNewCard] = useState({
        last4: '',
        brand: 'Visa',
        expiryMonth: '',
        expiryYear: ''
    });

    useEffect(() => {
        fetchCards();
    }, [user]);

    const fetchCards = async () => {
        if (user) {
            try {
                const data = await api.getCards(user.id);
                setCards(data);
            } catch (error) {
                console.error("Failed to load cards", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddCard = async (e) => {
        e.preventDefault();
        try {
            // Simulate tokenization
            const token = `tok_${Math.random().toString(36).substr(2, 9)}`;

            await api.addCard({
                userId: user.id,
                ...newCard,
                token
            });
            setAdding(false);
            setNewCard({ last4: '', brand: 'Visa', expiryMonth: '', expiryYear: '' });
            fetchCards();
        } catch (error) {
            alert('Failed to add card');
        }
    };

    const deleteCard = async (id) => {
        if (window.confirm('Delete this card?')) {
            try {
                await api.deleteCard(id);
                fetchCards();
            } catch (error) {
                alert('Failed to delete card');
            }
        }
    };

    const setDefault = async (id) => {
        try {
            await api.setDefaultCard(id);
            fetchCards();
        } catch (error) {
            alert('Failed to set default');
        }
    };

    if (loading) return <div>Loading cards...</div>;

    return (
        <div className="my-cards">
            <h2>Payment Methods</h2>

            <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {cards.map(card => (
                    <div key={card.id} className="card-item" style={{
                        border: card.isDefault ? '2px solid #C7E008' : '1px solid #ddd',
                        padding: '20px',
                        borderRadius: '12px',
                        position: 'relative',
                        background: '#fff'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{card.brand}</span>
                            {card.isDefault && <CheckCircle size={20} color="#C7E008" />}
                        </div>
                        <div style={{ fontSize: '1.5em', letterSpacing: '2px', marginBottom: '15px', color: '#555' }}>
                            **** **** **** {card.last4}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#888' }}>Exp: {card.expiryMonth}/{card.expiryYear}</span>
                            <div className="card-actions">
                                {!card.isDefault && (
                                    <button onClick={() => setDefault(card.id)} className="btn-text" style={{ marginRight: '10px', fontSize: '0.9em' }}>Make Default</button>
                                )}
                                <button onClick={() => deleteCard(card.id)} className="btn-icon" style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!adding ? (
                <button onClick={() => setAdding(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={20} /> Add New Card
                </button>
            ) : (
                <form onSubmit={handleAddCard} className="add-card-form" style={{ maxWidth: '400px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                    <h3>Add New Card</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Card Brand</label>
                        <select
                            value={newCard.brand}
                            onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="Visa">Visa</option>
                            <option value="MasterCard">MasterCard</option>
                            <option value="Amex">American Express</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Card Number (Last 4 Digits)</label>
                        <input
                            type="text"
                            maxLength="4"
                            placeholder="1234"
                            value={newCard.last4}
                            onChange={(e) => setNewCard({ ...newCard, last4: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Expiry Month</label>
                            <input
                                type="text"
                                placeholder="MM"
                                maxLength="2"
                                value={newCard.expiryMonth}
                                onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Expiry Year</label>
                            <input
                                type="text"
                                placeholder="YY"
                                maxLength="2"
                                value={newCard.expiryYear}
                                onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" onClick={() => setAdding(false)} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Card</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MyCards;

import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import bot from '../assets/images/bot3.svg';
import ChatbotMini from './chatbot/chatbotmini.js';
import { searchActivities, getIsLoading } from "../utils/mockApi";
import Logo from "../../public/logo1.png";
import Navbar from "../components/NavBar.js";

const Activity: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialSelectedActivities = location.state?.selectedActivities || [];
    
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [domain, setDomain] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activities] = useState<string[]>([
        "11108 - Prédictions météorologiques",
        "11115 - Practicien aéronautique en météorologie",
        "20010 - Conseil en management",
        "20011 - Conseil en marketing",
        "30005 - Formation continue en informatique",
    ]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>(initialSelectedActivities);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [lastSearchedQuery, setLastSearchedQuery] = useState("");  // Add this new state

    const toggleChatbot = () => {
        setIsChatbotOpen(!isChatbotOpen);
    };

    const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDomain(e.target.value);
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsSearching(true);

        if (value.length < 4) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        // Only search if the query is different from the last searched query and no request is pending
        if (value !== lastSearchedQuery && !getIsLoading()) {
            try {
                const results = await searchActivities(value);
                setSearchResults(results);
                setLastSearchedQuery(value);
            } catch (error) {
                console.error('Error searching activities:', error);
            }
        }
        setIsSearching(false);
    };

    const filteredActivities = searchTerm.length >= 2 ? searchResults : activities;

    const handleAddActivity = (activity: string) => {
        if (!selectedActivities.includes(activity) && selectedActivities.length < 5) {
            setSelectedActivities((prev) => [...prev, activity]);
        }
    };

    const handleRemoveActivity = (activity: string) => {
        setSelectedActivities((prev) => prev.filter((a) => a !== activity));
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="relative w-screen min-h-screen bg-gray-100 ">
            {/* Top Navigation */}
            <Navbar />

            {/* Hero Header */}
            <div className="py-12 text-center text-white bg-green-800">
                <img src={Logo} alt="logo" className="w-60 h-30 mx-auto mb-6" />
                <h1 className="mb-2 text-xl font-bold">Ajouter Une Activité a Votre Profile</h1>
            </div>
    
        <div className="w-screen ">
            <div className="w-full min-h-screen px-4 bg-gray-100">
                <div className="w-full p-4 pt-20 mx-auto">
                    <h2 className="mb-4 text-xl font-semibold text-gray-600">Votre activité</h2>
                    <p className="mb-6 text-gray-700">
                        Veuillez fournir des détails relatifs à l'activité ou aux activités que
                        vous souhaitez exercer en tant qu'auto-entrepreneur.
                    </p>

                    {/* Domaine d'activité */}
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-700">
                            Domaine d'activité
                        </label>
                        <select
                            value={domain}
                            onChange={handleDomainChange}
                            className="w-full p-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">-- Sélectionnez un domaine --</option>
                            <option value="10000 - Conseil, Expertise et formation">
                                10000 - Conseil, Expertise et formation (الخدمات الاستشارية والخبرات والتكوين)
                            </option>
                            <option value="20000 - Autre domaine 1">20000 - Autre domaine 1</option>
                            <option value="30000 - Autre domaine 2">30000 - Autre domaine 2</option>
                        </select>
                    </div>

                    {/* Choix de l'Activité (two-column layout on larger screens) */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Left side: "Liste des activités" + search bar */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <label className="block font-medium text-gray-700">
                                    Rechercher
                                </label>
                                <div className="relative group">
                                    <svg 
                                        className="w-5 h-5 text-gray-400 cursor-help"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                    </svg>
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center">
                                        Recherche optimisée par IA pour de meilleures suggestions
                                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full p-2 mb-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            {/* Scrollable list of filtered activities */}
                            <div className="h-64 overflow-y-auto text-gray-600 border border-gray-300 rounded-md">
                                {filteredActivities.length > 0 ? (
                                    filteredActivities.map((activity) => (
                                        <div
                                            key={activity}
                                            className="p-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleAddActivity(activity)}
                                        >
                                            {activity}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        {searchTerm.length >= 2 ? "Aucune activité trouvée" : "Commencez à taper pour chercher"}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <Button text="Liste des activités" />
                            </div>
                        </div>

                        {/* Right side: "Activités sélectionnées" */}
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">
                                Activités sélectionnées (Max: 05)
                            </label>
                            <div className="h-64 overflow-y-auto text-gray-700 border border-gray-300 rounded-md">
                                {selectedActivities.map((activity) => (
                                    <div
                                        key={activity}
                                        className="flex items-center justify-between p-2 hover:bg-gray-100"
                                    >
                                        <span>{activity}</span>
                                        <button
                                            onClick={() => handleRemoveActivity(activity)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                        <Button text="Précédent" onClick={handleBack} />
                        <Button text="Suivant" />
                    </div>
                </div>
            </div>

            {/* Chatbot Toggle Button */}<img
                src={bot}
                alt="Bot"
                onClick={toggleChatbot}
                className="fixed w-16 h-16 cursor-pointer md:w-32 md:h-32 bottom-4 right-4"
            />

            {isChatbotOpen && (
                <div className="fixed bottom-0 right-4">
                    <ChatbotMini onClose={toggleChatbot} />
                </div>
            )}
        </div>
        </div>

    );
};

export default Activity;
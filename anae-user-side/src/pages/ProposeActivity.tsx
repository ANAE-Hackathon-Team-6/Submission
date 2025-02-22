import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import TextArea from "../components/TextArea";
import Checkbox from "../components/CheckBox";
import Button from "../components/Button";
import Logo from "../../public/logo1.png";
import bot from "../assets/images/bot3.svg";
import ChatbotMini from "./chatbot/chatbotmini.js";
import Headcopied from '../components/Head'
import { searchActivities, getIsLoading } from "../utils/mockApi";

const ProposeActivity: React.FC = () => {
    const navigate = useNavigate();
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [activityInput, setActivityInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hasSuggestions, setHasSuggestions] = useState(false);  // New state
    const [lastSearchedQuery, setLastSearchedQuery] = useState("");  // Add this state
    const [activite, setActivite] = useState("");

    const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);

    // Dummy data for suggestions (replace with API fetch logic)
    const allActivities = [
        "Prédictions météorologiques",
        "Conseil en management",
        "Formation continue en informatique",
        "Développement web",
        "Analyse de données",
    ];

    // Update suggestions as user types
    useEffect(() => {
        if (activite) {
            const filtered = allActivities.filter((activity) =>
                activity.toLowerCase().includes(activite.toLowerCase())
            );
            setSuggestions(filtered);
            console.log("filtered", filtered);
        } else {
            setSuggestions([]);
        }
    }, [activite]);

    // Handle activity selection
    const handleSelectActivity = (activity: string) => {
        if (!selectedActivities.includes(activity) && selectedActivities.length < 5) {
            setSelectedActivities((prev) => [...prev, activity]);
            setActivite(""); // Clear input after selection
            setSuggestions([]);
            console.log("selectedActivities", selectedActivities);
        }
    };


    const handleActivityInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setActivityInput(value);

        if (value.length < 4) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Only search if the query is different from the last searched query and no request is pending
        if (value !== lastSearchedQuery && !getIsLoading()) {
            try {
                const results = await searchActivities(value);
                setSuggestions(results);
                setShowSuggestions(true);
                setHasSuggestions(results.length > 0);
                setLastSearchedQuery(value);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }
    };

    const handleSelectSuggestion = (activity: string) => {
        if (!selectedActivities.includes(activity)) {
            setSelectedActivities([...selectedActivities, activity]);
        } else {
            setSelectedActivities(selectedActivities.filter(a => a !== activity));
        }
    };

    const goToActivityPage = () => {
        if (selectedActivities.length > 0) {
            navigate('/activity', { state: { selectedActivities } });
        }
    };


    return (
        <div className="relative w-screen min-h-screen bg-gray-100"> <Headcopied />

<div className="w-full max-w-5xl px-4 mx-auto -mt-10">
                <div className="relative z-10 p-8 bg-white rounded-lg shadow-lg">

                    <h2 className="mb-6 text-2xl font-semibold text-center">
                        Proposer une activité - اقترح نشاط
                    </h2>

                    <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SelectField
                            label="Domaine d'activité / مجال النشاط"
                            name="domaine"
                            options={["Technologie", "Agriculture", "Santé"]}
                            required />

                        {/* Activity input */}
                        <div className="relative md:col-span-2">
                            <InputField
                                label="Activité proposée / النشاط المقترح"
                                name="activite"
                                value={activityInput}
                                onChange={handleActivityInput}
                                placeholder="Commencez à taper pour voir les suggestions..."
                                required />

                            {/* Button to reopen suggestions */}
                            {!showSuggestions && hasSuggestions && (
                                <button
                                    type="button"
                                    onClick={() => setShowSuggestions(true)}
                                    className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Voir les activités similaires ({suggestions.length})
                                </button>
                            )}
                        </div>

                        {/* Suggestions Section - Now part of the form layout */}
                        <div className={`md:col-span-2 transition-all duration-300 ease-in-out overflow-hidden ${showSuggestions && suggestions.length > 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="p-4 bg-white border rounded-lg shadow-md">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            Activités similaires trouvées ({suggestions.length})
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowSuggestions(false)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                        {suggestions.map((activity) => (
                                            <div
                                                key={activity}
                                                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100 transition-colors"
                                                onClick={() => handleSelectSuggestion(activity)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedActivities.includes(activity)}
                                                    readOnly
                                                    className="w-4 h-4 mr-3 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                                <span className="text-gray-700">{activity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedActivities.length > 0 && (
                                        <div className="mt-4 flex justify-between items-center border-t pt-3">
                                            <span className="text-sm text-gray-600">
                                                {selectedActivities.length} activité(s) sélectionnée(s)
                                            </span>
                                            <Button
                                                text="Continuer avec la sélection"
                                                onClick={goToActivityPage} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description field */}
                        <div className="md:col-span-2">
                            <TextArea
                                label="Description de l'activité proposée / وصف النشاط المقترح"
                                name="description"
                                placeholder="Dites-nous en plus..."
                                required />
                        </div>

                        {/* Row 1 */}
                        <InputField
                            label="Nom / اللقب"
                            name="nom"
                            placeholder="Entrez votre nom"
                            required />
                        <InputField
                            label="Prénom / الاسم"
                            name="prenom"
                            placeholder="Entrez votre prénom"
                            required />

                        <InputField
                            label="Tél / رقم الهاتف"
                            name="tel"
                            type="tel"
                            placeholder="Entrez votre numéro de téléphone"
                            required />
                        <InputField
                            label="Email / البريد الإلكتروني"
                            name="email"
                            type="email"
                            placeholder="Entrez votre email" />

                        <SelectField
                            label="Wilaya / الولاية"
                            name="wilaya"
                            options={["Alger", "Oran", "Constantine"]}
                            required />

                        <div className="flex flex-col gap-3 md:col-span-2">
                            <Checkbox label="Je ne suis pas un robot" name="captcha" />
                            <Checkbox
                                label="J’accepte le traitement des données personnelles"
                                name="consent" />
                        </div>

                        <div className="flex justify-center md:col-span-2">
                            <Button text="Envoyer / إرسال" />
                        </div>
                    </form>

                    <div className="mt-8">
                        <h3 className="mb-2 font-semibold">Activités sélectionnées :</h3>
                        <ul>
                            {selectedActivities.map((activity, index) => (
                                <li key={index} className="p-1">{activity}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <img
                src={bot}
                alt="Bot"
                onClick={toggleChatbot}
                className="fixed w-16 h-16 z-99 cursor-pointer md:w-32 md:h-32 bottom-4 right-4"
            />

            {isChatbotOpen && (
                <div className="fixed bottom-0 right-4 z-[9999]">
                    <ChatbotMini onClose={toggleChatbot} />
                </div>
            )}



        </div>
    );
};

export default ProposeActivity;

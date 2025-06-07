import React, {useState, useEffect} from 'react';
import {Copy, Check, User, Vote, Award} from 'lucide-react';

const MinecraftVotingApp = () => {
    const [username, setUsername] = useState('');
    const [copiedStates, setCopiedStates] = useState({});
    const [votedSites, setVotedSites] = useState({});
    const [currentSite, setCurrentSite] = useState(null);
    const [timeUntilReset, setTimeUntilReset] = useState('');
    const [totalVotes, setTotalVotes] = useState(0);

    // BadWolfMC voting sites
    // More info on this is in the README.md file
    // type is either 'link' or 'iframe'
    const votingSites = [
        {name: 'FindMCServer', url: 'https://link.bwmc.app/findmcweb', id: 'findmc', type: 'link'},
        {name: 'Planet Minecraft', url: 'https://link.bwmc.app/pmcweb', id: 'planetmc', type: 'link'},
        {name: 'Top Gaming List', url: 'https://link.bwmc.app/topgweb', id: 'topg', type: 'link'},
        {name: 'MCLike', url: 'https://link.bwmc.app/likeweb', id: 'mclike', type: 'link'},
        {name: 'MCList', url: 'https://link.bwmc.app/mclistioweb', id: 'mclistio', type: 'link'},
        {name: 'Minecraft Buzz', url: 'https://link.bwmc.app/buzzweb', id: 'mcbuzz', type: 'link'},
        {name: 'Minecraft-MP', url: 'https://link.bwmc.app/mcmpweb', id: 'mcmp', type: 'link'},
        {name: 'MinecraftServers.org', url: 'https://link.bwmc.app/servorgweb', id: 'mcservers', type: 'link'},
        {name: 'Minecraft-Server-List', url: 'https://link.bwmc.app/listweb', id: 'mcserverlist', type: 'link'},
        {name: 'Minecraft-Server.net', url: 'https://link.bwmc.app/servnetweb', id: 'mcservernet', type: 'link'},
        {name: 'MinecraftList.org', url: 'https://link.bwmc.app/list2web', id: 'mclist', type: 'link'},
        {name: 'Minecraft-Tracker', url: 'https://link.bwmc.app/trackweb', id: 'mctracker', type: 'link'}
    ];

    // Get current EST date string for reset checking
    const getCurrentESTDateString = () => {
        const now = new Date();
        const est = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));

        // If it's before 1 AM, consider it the previous day for voting purposes
        if (est.getHours() < 1) {
            est.setDate(est.getDate() - 1);
        }

        return est.toDateString();
    };

    // Calculate time until next voting reset (1 AM EST)
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const est = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));

            // Calculate next 1 AM EST
            const tomorrow = new Date(est);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(1, 0, 0, 0);

            // If it's already past 1 AM today, use tomorrow's 1 AM
            const today1AM = new Date(est);
            today1AM.setHours(1, 0, 0, 0);

            const nextReset = est > today1AM ? tomorrow : today1AM;

            const timeDiff = nextReset - est;
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                setTimeUntilReset(`${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`);
            } else {
                setTimeUntilReset(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Load saved data on component mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('minecraft-username');
        const savedVotes = localStorage.getItem('minecraft-votes');
        const savedTotalVotes = localStorage.getItem('minecraft-total-votes');
        const currentDateString = getCurrentESTDateString();

        if (savedUsername) {
            setUsername(savedUsername);
        }

        if (savedTotalVotes) {
            setTotalVotes(parseInt(savedTotalVotes, 10) || 0);
        }

        if (savedVotes) {
            const votesData = JSON.parse(savedVotes);
            if (votesData.date === currentDateString) {
                setVotedSites(votesData.sites);
            } else {
                // New day, reset votes but keep total
                localStorage.removeItem('minecraft-votes');
                setVotedSites({});
            }
        }
    }, []);

    // Save username when it changes
    useEffect(() => {
        if (username) {
            localStorage.setItem('minecraft-username', username);
        }
    }, [username]);

    // Save voted sites
    useEffect(() => {
        const currentDateString = getCurrentESTDateString();
        localStorage.setItem('minecraft-votes', JSON.stringify({
            date: currentDateString,
            sites: votedSites
        }));
    }, [votedSites]);

    // Save total votes
    useEffect(() => {
        localStorage.setItem('minecraft-total-votes', totalVotes.toString());
    }, [totalVotes]);

    const copyUsername = async () => {
        if (!username) return;

        try {
            await navigator.clipboard.writeText(username);
            setCopiedStates({username: true});
            setTimeout(() => {
                setCopiedStates(prev => ({...prev, username: false}));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy username:', err);
        }
    };

    const handleSiteClick = (site, event) => {
        if (site.type === 'link') {
            // Open in new window/tab
            window.open(site.url, '_blank', 'noopener,noreferrer');
            event.stopPropagation();
            setVotedSites(prev => {
                const newState = {...prev};
                const wasVoted = newState[site.id];

                if (wasVoted) {
                    //do nothing
                } else {
                    // Add vote
                    newState[site.id] = true;
                    setTotalVotes(prevTotal => prevTotal + 1);
                }

                return newState;
            });
        } else {
            // Open in iframe
            setCurrentSite(site);
        }
    };

    const toggleVoteStatus = (siteId, event) => {
        event.stopPropagation(); // Prevent opening the site when clicking the checkbox

        setVotedSites(prev => {
            const newState = {...prev};
            const wasVoted = newState[siteId];

            if (wasVoted) {
                // Remove vote
                delete newState[siteId];
                setTotalVotes(prevTotal => Math.max(0, prevTotal - 1));
            } else {
                // Add vote
                newState[siteId] = true;
                setTotalVotes(prevTotal => prevTotal + 1);
                console.log('toggleVoteStatus - adding vote for ', siteId);
            }

            return newState;
        });
    };

    const goHome = () => {
        setCurrentSite(null);
    };

    const completedVotes = Object.keys(votedSites).length;
    const progressPercentage = (completedVotes / votingSites.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-black/30 backdrop-blur-sm border-b border-white/20 p-4">
                <div
                    className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-6">
                    {/* Left side - Logo and title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goHome}
                            className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                <Vote className="w-5 h-5 text-amber-900"/>
                            </div>
                            <span className="text-white font-bold text-xl">BadWolfMC Votes</span>
                        </button>

                        {currentSite && (
                            <div className="flex items-center gap-2 text-emerald-300">
                                <span className="text-white/60">→</span>
                                <span className="font-medium">{currentSite.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Center - Username */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-emerald-300"/>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your Minecraft username"
                                className="px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent w-full sm:w-48"
                            />
                        </div>
                        <button
                            onClick={copyUsername}
                            disabled={!username}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center ${
                                username
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {copiedStates.username ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                            {copiedStates.username ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    {/* Right side - Progress and Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-400"/>
                            <span className="text-white font-semibold">{completedVotes}/12</span>
                        </div>
                        <div className="w-full sm:w-24 bg-white/20 rounded-full h-2">
                            <div
                                className="h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                                style={{width: `${progressPercentage}%`}}
                            ></div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-white/60">Total Votes</div>
                            <div className="text-white font-bold">{totalVotes.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Home View */}
                {!currentSite ? (
                    <div className="flex-1 p-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Welcome Section */}
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-white mb-4">Ready to Earn Your Loyalty
                                    Points?</h1>
                                <p className="text-emerald-200 text-lg mb-6">
                                    Vote for BadWolfMC on all 12 sites to earn valuable in-game rewards obtainable using
                                    loyalty points!
                                </p>

                                {completedVotes === votingSites.length && (
                                    <div>
                                        <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 mb-6">
                                            <div className="flex items-center justify-center gap-2 text-emerald-300">
                                                <Award className="w-6 h-6"/>
                                                <span className="text-xl font-bold">All votes completed! Your loyalty points are on the way! 🎉</span>
                                            </div>
                                        </div>
                                        {/* Vote Reset Countdown */}
                                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
                                            <div className="text-center">
                                                <p className="text-blue-200 text-sm">
                                                You will be able to vote again in approximately <span
                                                className="font-bold">{timeUntilReset}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Voting Sites Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {votingSites.map((site) => {
                                    const isVoted = votedSites[site.id];

                                    return (
                                        <div
                                            key={site.id}
                                            onClick={(e) => handleSiteClick(site, e)}
                                            className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 hover:scale-105 text-left cursor-pointer ${
                                                isVoted
                                                    ? 'border-emerald-400/50 bg-emerald-500/20'
                                                    : 'border-white/20 hover:border-white/40'
                                            }`}
                                        >
                                            {/* Vote Status Checkbox */}
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    onClick={(e) => toggleVoteStatus(site.id, e)}
                                                    className={`w-6 h-6 rounded border-2 transition-colors flex items-center justify-center ${
                                                        isVoted
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : 'border-white/40 hover:border-white/60'
                                                    }`}
                                                >
                                                    {isVoted && <Check className="w-4 h-4 text-white"/>}
                                                </button>
                                            </div>

                                            <h3 className="text-white font-semibold mb-2 pr-8">{site.name}</h3>
                                            <div
                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                                                    isVoted
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-blue-600 text-white'
                                                }`}>
                                                {isVoted ? 'Voted!' : 'Vote Now'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Instructions */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mt-8 border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-3">How to Vote & Earn Rewards:</h3>
                                <ol className="text-emerald-200 space-y-2">
                                    <li>1. Enter your Minecraft username in the top bar and click the button to copy
                                        it
                                    </li>
                                    <li>2. Click on any voting site to open it in a new tab</li>
                                    <li>3. Paste your username and complete the captcha where needed</li>
                                    <li>4. Submit your vote for BadWolfMC. This will add 1 loyalty point to your
                                        account
                                    </li>
                                    <li>5. Return to this tab and check off completed votes</li>
                                    <li>6. Complete all 12 votes daily to maximize your rewards!</li>
                                </ol>
                                <div className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                                    <p className="text-red-200 text-sm">
                                        ⚠️ <strong>Caution!</strong> Ensure that you type in your username correctly,
                                        otherwise
                                        you may not receive any loyalty points! This is why we recommend copying and
                                        pasting your username instead of typing it in.
                                    </p>
                                </div>
                                <div className="mt-4 p-3 bg-amber-500/20 border border-amber-400/30 rounded-lg">
                                    <p className="text-amber-200 text-sm">
                                        💰 <strong>Reward Reminder:</strong> Each vote helps BadWolfMC climb the rankings
                                        and earns you valuable in-game rewards!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* iframe View */
                    <div className="flex-1 bg-white">
                        <iframe
                            src={currentSite.url}
                            className="w-full h-full border-0"
                            title={`Vote on ${currentSite.name}`}
                            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                        />
                    </div>
                )}
            </div>
            <footer className="body-font">
                <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
                    <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-400">
                        <span className="ml-3 text-xl">BadWolfMC Voting Tool</span>
                    </a>
                    <p className="text-sm text-gray-200 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                        © 2025 BadWolfMC Voting Tool — Credit to <a href="https://badwolfmc.com"
                                                                    className="text-gray-400 ml-1"
                                                                    target="_blank">BadWolfMC.com</a>
                    </p>
                    <p className="flex-auto text-sm text-gray-200 text-right md:justify-end">
                        This tool is an independent project and is not affiliated with BadWolfMC, Mojang Studios, or
                        Microsoft. <br/>
                        Minecraft is a trademark of Mojang Studios and Microsoft. <br/>
                        We do not collect or track any personal data. All user data is stored locally on your device.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MinecraftVotingApp;
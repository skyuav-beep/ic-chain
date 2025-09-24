/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

type Screen = 'auth' | 'dashboard' | 'wallet' | 'p2p' | 'transfer' | 'mining';
type WalletTab = 'tokens' | 'nfts';
type P2PTab = 'all' | 'buy' | 'sell';

// --- SVG Icons ---
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z" clipRule="evenodd" /></svg>);
const WalletConnectIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>);
const BackArrowIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const QRCodeIcon = () => (<svg className="w-full h-full text-slate-800" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M120 40H40v80h80V40Zm-8 72H48V48h64v64Zm120-72h-80v80h80V40Zm-8 72h-64V48h64v64Zm-40 40H40v80h80v-80Zm-8 72H48v-64h64v64Zm120-72h-80v80h80v-80Zm-8 72h-64v-64h64v64ZM64 64h32v32H64V64Zm128 0h32v32h-32V64ZM64 160h32v32H64v-32Z"/></svg>);
const LogoIcon = ({ className }: { className?: string }) => (
    <svg width="171" height="57" viewBox="0 0 171 57" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_534_1473_fix)">
            <path d="M13.1098 25.48H20.3898V25.53L19.9898 26.02H13.5098L13.1098 25.53V25.48ZM12.4798 24.84H20.9998V20.85H19.2898V22.72H17.5998V20.85H15.8798V22.72H14.1098V20.85H12.4798V24.84ZM19.8198 26.65V39.46C15.9098 37.94 12.3398 39.34 12.3398 39.34C12.6098 35.8 13.6998 26.65 13.6998 26.65H19.8298H19.8198ZM16.7298 28.47C15.8398 28.47 15.7798 29.83 15.7798 29.83V31.31H17.5298V29.85C17.5298 29.85 17.6098 28.48 16.7198 28.48L16.7298 28.47ZM46.4898 25.48H39.2098V25.53L39.6098 26.02H46.0898L46.4898 25.53V25.48ZM47.1198 20.86H45.4898V22.73H43.7198V20.86H41.9998V22.73H40.3098V20.86H38.5998V24.85H47.1198V20.86ZM45.9198 26.65C45.9198 26.65 47.3998 39.26 47.6698 42.8C47.6698 42.8 43.7298 43.1 39.7898 40.92V26.65H45.9198ZM42.0698 29.85V31.31H43.8198V29.83C43.8198 29.83 43.7598 28.47 42.8698 28.47C41.9798 28.47 42.0598 29.84 42.0598 29.84L42.0698 29.85ZM23.3798 18.45C30.0698 17.84 36.3098 18.45 36.3098 18.45V14.21H34.7198V16.06H32.9198V14.21H30.8498V16.06H28.9098V14.21H26.8698V16.06H25.0498V14.21H23.2998L23.3698 18.45H23.3798ZM24.0498 19.03L24.5498 19.54C24.5498 19.54 30.6598 19.13 35.0398 19.54L35.6198 19.03C35.6198 19.03 29.5798 18.26 24.0498 19.03ZM24.8598 20.24V27.65H27.5198V29.51H28.4298V27.66H31.1898V29.51H32.2898V27.66H34.8098V20.25C34.8098 20.25 29.3198 19.71 24.8698 20.25L24.8598 20.24ZM26.4298 13.14H33.4198L30.1698 8.65004V6.65004C30.1698 6.65004 31.7098 6.38004 32.6498 6.70004C33.5898 7.02004 35.3298 7.10004 36.4298 5.48004C36.4298 5.48004 34.2798 6.05004 33.2198 4.81004C32.1698 3.58004 30.1498 4.16004 30.1498 4.16004V3.50004L29.7698 3.04004L29.3598 3.52004V8.64004L26.4298 13.13V13.14ZM20.8298 28.24L20.9998 39.85C20.9998 39.85 24.0898 41.77 26.8098 41.46V35.54C26.8098 35.54 26.9798 32.95 29.8198 32.95C32.6598 32.95 32.9198 35.63 32.9198 35.63V39.84C32.9198 39.84 35.3898 39.24 38.6098 40.55V28.25H36.5798V30.13H34.9298V28.25H33.0098V30.07H30.5798V28.25H29.0498V30.07H26.6698V28.25H24.6798V30.11H23.0498V28.25H20.8298V28.24Z" fill="#3850A1"/>
            <path d="M18.9598 44.0299C24.4298 46.8799 28.5798 45.0099 28.5798 45.0099C35.4198 42.2199 38.3398 44.7199 41.3998 45.4999C44.4598 46.2799 46.0498 45.8899 47.6598 45.4999C49.2698 45.1099 50.7298 43.7799 50.7298 43.7799C45.2298 44.9599 42.2598 43.4099 40.0298 42.4699C37.7898 41.5199 34.0298 40.3899 30.8998 41.6599C27.7698 42.9299 24.6398 43.3599 21.5898 41.6599C18.5398 39.9599 15.7798 39.9399 15.7798 39.9399C11.1198 39.6999 8.0498 43.3899 8.0498 43.3899C8.1098 43.3099 13.4998 41.1899 18.9598 44.0399V44.0299ZM11.0098 45.9499C11.0098 45.9499 15.7298 45.8499 18.8898 48.1499C22.0498 50.4499 28.2498 49.5799 28.8498 49.3099C29.4398 49.0399 34.2598 46.7599 37.3698 47.8199C40.4798 48.8899 43.7898 49.0799 45.2298 48.1699C45.2298 48.1699 42.9298 48.1899 39.6698 46.8899C36.4098 45.5799 33.9398 45.2299 30.8998 46.1699C27.8598 47.1099 26.8698 47.7799 23.9098 47.5299C20.9498 47.2799 18.9398 46.0199 18.9398 46.0199C18.9398 46.0199 15.1398 43.8499 11.0098 45.9499ZM15.6598 49.9999C15.6598 49.9999 20.1298 53.8999 25.8898 53.6299C25.8898 53.6299 29.3698 53.5299 31.4698 52.3899C33.5698 51.2499 35.6898 51.5299 36.8098 51.5999C37.9198 51.6699 39.6298 51.7499 41.1798 51.2599C41.1798 51.2599 39.5498 51.2799 37.3098 50.4199C35.0698 49.5599 32.2498 49.8199 29.9798 50.8799C27.7098 51.9299 24.4898 51.9499 23.1698 51.7799C21.8498 51.6099 17.0998 50.0499 15.6598 49.9999Z" fill="#1DADC9"/>
            <path d="M59.71 25.2699V22.6299H62.4V25.2699H59.71ZM59.71 40.4099V27.5299H62.38V40.4099H59.71Z" fill="#3850A1"/>
            <path d="M86.11 28.1303C85.84 27.3203 85.36 26.5503 84.66 25.8303C83.96 25.1103 82.87 24.7503 81.4 24.7503C79.77 24.7503 78.49 25.3703 77.57 26.6103C76.64 27.8503 76.17 29.5003 76.17 31.5803C76.17 33.6603 76.63 35.3003 77.57 36.5703C78.5 37.8403 79.78 38.4803 81.4 38.4803C82.83 38.4803 83.92 38.0703 84.66 37.2603C85.41 36.4503 85.91 35.5803 86.16 34.6403H89.02C88.7 36.0503 87.94 37.4603 86.72 38.8503C85.5 40.2503 83.73 40.9403 81.4 40.9403C78.88 40.9403 76.89 40.0703 75.43 38.3403C73.98 36.6103 73.25 34.3503 73.25 31.5803C73.25 28.8103 73.98 26.5703 75.43 24.8503C76.88 23.1403 78.87 22.2803 81.4 22.2803C83.77 22.2803 85.58 22.9503 86.81 24.3003C88.04 25.6503 88.79 26.9203 89.05 28.1303H86.11Z" fill="#3850A1"/>
            <path d="M103 40.4604L101.28 36.1804H93.0596L91.3696 40.4604H88.5996L95.5996 22.6504H98.7096L105.76 40.4604H103ZM97.1696 25.7204L94.0796 33.6404H100.28L97.1696 25.7204Z" fill="#3850A1"/>
            <path d="M119.35 33.0901C119.91 33.9701 120.12 34.9401 119.98 36.0001C119.81 37.3601 119.16 38.5601 118.01 39.6101C116.87 40.6601 115.23 41.1801 113.1 41.1801C110.74 41.1801 108.97 40.4501 107.79 38.9901C106.61 37.5301 106.01 36.0201 106 34.4601H108.74C108.77 35.7401 109.2 36.7601 110.03 37.5201C110.86 38.2801 111.88 38.6701 113.09 38.6701C114.3 38.6701 115.24 38.4001 115.85 37.8701C116.46 37.3401 116.85 36.6901 117.02 35.9301C117.17 35.3201 117.08 34.8001 116.75 34.3701C116.42 33.9501 115.94 33.5901 115.3 33.2901C114.54 32.9101 113.71 32.6801 112.82 32.6201C111.93 32.5501 111.04 32.3401 110.14 31.9701C108.94 31.4901 108.03 30.8701 107.4 30.1301C106.77 29.3801 106.49 28.4001 106.55 27.1901C106.62 26.0101 107.17 24.8701 108.22 23.7501C109.27 22.6301 110.84 22.0801 112.95 22.0801C115.41 22.0801 117.11 22.8101 118.04 24.2701C118.98 25.7301 119.43 26.9801 119.4 28.0101H116.68C116.66 27.0801 116.36 26.2701 115.76 25.5901C115.16 24.9101 114.22 24.5701 112.94 24.5701C111.76 24.5701 110.9 24.8601 110.35 25.4301C109.8 26.0001 109.52 26.6001 109.5 27.2401C109.48 27.9501 109.7 28.4901 110.16 28.8501C110.62 29.2101 111.11 29.4801 111.64 29.6601C112.29 29.8801 113.11 30.0601 114.09 30.2101C115.08 30.3601 116.05 30.6601 116.99 31.1101C117.97 31.5601 118.74 32.2201 119.29 33.1001L119.35 33.0901Z" fill="#3850A1"/>
            <path d="M128.379 25.1697V40.4597L125.639 40.4097L125.609 25.1697H119.979V22.6797H134.079V25.1697H128.379Z" fill="#3850A1"/>
            <path d="M135.85 40.4097V22.6797H138.57V37.9497H147.76V40.4197H135.85V40.4097Z" fill="#3850A1"/>
            <path d="M149.4 40.4097V22.6797H161.8L161.83 25.1697H152.12V30.0497L161.39 30.0797V32.5197H152.12V37.9497H162.03V40.4197H149.4V40.4097Z" fill="#3850A1"/>
            <path d="M70.1603 30.4297H65.5303V32.8297H70.1603V30.4297Z" fill="#3850A1"/>
        </g>
        <defs>
            <clipPath id="clip0_534_1473_fix">
                <rect width="170.08" height="56.69" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);


// --- Modal Component ---
const WalletConnectModal = ({ isOpen, onClose, onConnect }: { isOpen: boolean; onClose: () => void; onConnect: () => void; }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm transform transition-all">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">WalletConnect</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors" aria-label="Close modal">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 text-center space-y-4">
                    <div className="w-64 h-64 mx-auto p-4 border border-slate-200 rounded-lg">
                       <QRCodeIcon />
                    </div>
                    <p className="text-slate-600">모바일 지갑으로 QR 코드를 스캔하여 연결하세요.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-b-2xl">
                     <button onClick={onConnect} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                        연결 시뮬레이션 (클릭)
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Screen Components ---

const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleWalletConnectLogin = () => {
        setIsModalOpen(false);
        onLogin();
    }

    return (
        <>
            <WalletConnectModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConnect={handleWalletConnectLogin}
            />
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-4">
                        <LogoIcon className="h-12 mx-auto" />
                        <p className="text-slate-500">ZKP로 안전하게 시작</p>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-slate-600 text-center">Web3 지갑으로 로그인</h3>
                            <button onClick={onLogin} className="w-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                                <LockIcon /> MetaMask 연결
                            </button>
                            <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-lg transition duration-300">
                                <WalletConnectIcon /> WalletConnect
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink mx-4 text-slate-400 text-xs">또는</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-slate-600 text-center">소셜 로그인</h3>
                            <button onClick={onLogin} className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-lg transition duration-300">카카오톡</button>
                            <button onClick={onLogin} className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-lg transition duration-300">구글</button>
                        </div>
                    </div>
                    <div className="text-center text-xs text-slate-500 pt-4">
                        <p>🛡️ 영지식 증명으로 개인정보를 안전하게 보호합니다</p>
                    </div>
                </div>
            </div>
        </>
    );
}

const DashboardScreen = ({ setActiveScreen }: { setActiveScreen: (screen: Screen) => void }) => (
    <div className="p-4 md:p-8 space-y-8">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">안녕하세요! 👋</h2>
            <p className="text-slate-500 mt-1">오늘도 안전한 디지털 자산 관리를 시작해보세요</p>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-2xl shadow-lg space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">총 보유 자산</h3>
                <span className="text-xl cursor-pointer" role="img" aria-label="refresh">🔄</span>
            </div>
            <p className="text-4xl font-bold">₩2,847,500</p>
            <div className="flex items-center text-teal-200">
                <span className="text-lg" role="img" aria-label="positive-change">📈</span>
                <span className="ml-1 font-medium">+127,500 (4.7%)</span>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-md text-center space-y-2 flex flex-col justify-between">
                <div className="text-4xl" role="img" aria-label="nft-ticket">🎫</div>
                <div>
                    <h4 className="font-bold text-slate-700">상품권 NFT</h4>
                    <p className="text-sm text-slate-500">12개 보유</p>
                </div>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm transition">전체 보기</button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md text-center space-y-2 flex flex-col justify-between">
                <div className="text-4xl" role="img" aria-label="mining">⛏️</div>
                <div>
                    <h4 className="font-bold text-slate-700">채굴 현황</h4>
                    <p className="text-sm text-green-500 font-semibold">활성 상태</p>
                </div>
                <button onClick={() => setActiveScreen('mining')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm transition">현황 보기</button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md text-center space-y-2 flex flex-col justify-between">
                <div className="text-4xl" role="img" aria-label="transfer-money">💸</div>
                <div>
                    <h4 className="font-bold text-slate-700">송금하기</h4>
                    <p className="text-sm text-slate-500">빠르고 안전한 전송</p>
                </div>
                <button onClick={() => setActiveScreen('transfer')} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition">송금하기</button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md text-center space-y-2 flex flex-col justify-between">
                <div className="text-4xl" role="img" aria-label="history">📊</div>
                 <div>
                    <h4 className="font-bold text-slate-700">거래 내역</h4>
                    <p className="text-sm text-slate-500">최근 활동 확인</p>
                </div>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm transition">내역 보기</button>
            </div>
        </div>
    </div>
);

const WalletScreen = () => {
    const [activeTab, setActiveTab] = useState<WalletTab>('tokens');

    const minedTokens = [
        { icon: '🐚', name: 'Coral Coin', symbol: 'CRC', amount: '3,450.12', value: '₩51,751', change: '+1.5%', changeColor: 'text-green-500' },
        { icon: '💧', name: 'Lagoon Token', symbol: 'LGN', amount: '1,234.56', value: '₩24,691', change: '-0.5%', changeColor: 'text-red-500' },
        { icon: '🗿', name: 'Tiki Token', symbol: 'TKI', amount: '5,678.90', value: '₩113,578', change: '+3.2%', changeColor: 'text-green-500' },
        { icon: '🌋', name: 'Volcano Coin', symbol: 'VLC', amount: '987.65', value: '₩49,382', change: '+8.1%', changeColor: 'text-green-500' },
        { icon: '⚪', name: 'Pearl Shard', symbol: 'PRL', amount: '10,293.45', value: '₩10,293', change: '+0.1%', changeColor: 'text-green-500' },
        { icon: '🌳', name: 'Jungle Gem', symbol: 'JGL', amount: '7,890.12', value: '₩78,901', change: '-2.3%', changeColor: 'text-red-500' },
        { icon: '☀️', name: 'Sunstone', symbol: 'SST', amount: '4,567.89', value: '₩91,357', change: '+5.6%', changeColor: 'text-green-500' },
        { icon: '💎', name: 'Aqua Ore', symbol: 'AQA', amount: '2,345.67', value: '₩46,913', change: '-1.8%', changeColor: 'text-red-500' },
    ];

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">아일랜드 월렛</h2>
                <div className="flex bg-slate-200 rounded-lg p-1">
                    <button onClick={() => setActiveTab('tokens')} className={`px-4 py-1 text-sm font-semibold rounded-md ${activeTab === 'tokens' ? 'bg-white shadow' : 'text-slate-600'}`}>Tokens</button>
                    <button onClick={() => setActiveTab('nfts')} className={`px-4 py-1 text-sm font-semibold rounded-md ${activeTab === 'nfts' ? 'bg-white shadow' : 'text-slate-600'}`}>NFTs</button>
                </div>
            </div>

            {activeTab === 'tokens' && (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-md flex items-center">
                        <div className="text-4xl mr-4" role="img" aria-label="island-coin">🪙</div>
                        <div className="flex-grow">
                            <h4 className="font-bold text-slate-800">Island Coin (ISC)</h4>
                            <p className="text-sm text-slate-500">1,247.89 ISC</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-slate-800">₩1,847,500</p>
                            <p className="text-sm text-green-500 font-medium">+2.3%</p>
                        </div>
                    </div>
                     <div className="bg-white p-4 rounded-2xl shadow-md flex items-center">
                        <div className="text-4xl mr-4" role="img" aria-label="ethereum">💎</div>
                        <div className="flex-grow">
                            <h4 className="font-bold text-slate-800">Ethereum (ETH)</h4>
                            <p className="text-sm text-slate-500">0.45 ETH</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-slate-800">₩1,000,000</p>
                            <p className="text-sm text-red-500 font-medium">-1.2%</p>
                        </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200">
                        <h3 className="px-1 pb-2 text-sm font-semibold text-slate-500">채굴된 자산</h3>
                        <div className="space-y-4">
                            {minedTokens.map(token => (
                                <div key={token.symbol} className="bg-white p-4 rounded-2xl shadow-md flex items-center">
                                    <div className="text-4xl mr-4" role="img" aria-label={`${token.name}-icon`}>{token.icon}</div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-slate-800">{token.name} ({token.symbol})</h4>
                                        <p className="text-sm text-slate-500">{token.amount} {token.symbol}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-800">{token.value}</p>
                                        <p className={`text-sm ${token.changeColor} font-medium`}>{token.change}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'nfts' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                        { icon: '🎫', name: '스타벅스 기프트카드', id: '#ISC-001', value: '₩50,000', status: '사용 가능', color: 'green' },
                        { icon: '🍔', name: '맥도날드 쿠폰', id: '#ISC-002', value: '₩15,000', status: '담보 중', color: 'orange' },
                        { icon: '🛍️', name: '신세계 상품권', id: '#ISC-003', value: '₩100,000', status: '사용 가능', color: 'green' }
                    ].map(nft => (
                        <div key={nft.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="bg-slate-100 h-32 flex items-center justify-center text-5xl">{nft.icon}</div>
                            <div className="p-4 space-y-1">
                                <h4 className="font-bold text-slate-800">{nft.name}</h4>
                                <p className="text-xs text-slate-400">{nft.id}</p>
                                <p className="font-semibold text-slate-600">{nft.value}</p>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${nft.color === 'green' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{nft.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const P2PScreen = () => {
    const [activeTab, setActiveTab] = useState<P2PTab>('all');

    const TradeItem = ({type, time, icon, name, amount, price, discount, seller, rating, reviews, actionText}) => (
        <div className="bg-white p-4 rounded-2xl shadow-md space-y-3">
            <div className="flex justify-between items-center text-xs">
                <span className={`font-bold px-2 py-1 rounded-full ${type === 'sell' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{type === 'sell' ? '팝니다' : '삽니다'}</span>
                <span className="text-slate-400">{time}</span>
            </div>
            <div className="flex items-center">
                <div className="text-4xl mr-4">{icon}</div>
                <div className="flex-grow">
                    <h4 className="font-bold text-slate-800">{name}</h4>
                    <p className="text-sm text-slate-500">{amount}</p>
                    <p className="text-sm font-semibold text-slate-700">{price}</p>
                    <p className={`text-sm font-bold ${type === 'sell' ? 'text-red-500' : 'text-blue-500'}`}>{discount}</p>
                </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div>
                    <p className="font-semibold text-sm text-slate-700">{seller}</p>
                    <p className="text-xs text-slate-400">{rating} ({reviews})</p>
                </div>
                <button className={`font-semibold py-2 px-4 rounded-lg text-sm transition ${type === 'sell' ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}>{actionText}</button>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">P2P 거래 🏪</h2>
                <p className="text-slate-500 mt-1">안전한 개인간 거래로 더 나은 가격에 거래하세요</p>
            </div>
             <div className="flex space-x-2">
                <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition">📝 판매등록</button>
                <button className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg transition">📋 내거래</button>
            </div>
             <div className="flex flex-col md:flex-row gap-4">
                <div className="flex bg-slate-200 rounded-lg p-1">
                    <button onClick={() => setActiveTab('all')} className={`px-4 py-1 text-sm font-semibold rounded-md ${activeTab === 'all' ? 'bg-white shadow' : 'text-slate-600'}`}>전체</button>
                    <button onClick={() => setActiveTab('buy')} className={`px-4 py-1 text-sm font-semibold rounded-md ${activeTab === 'buy' ? 'bg-white shadow' : 'text-slate-600'}`}>삽니다</button>
                    <button onClick={() => setActiveTab('sell')} className={`px-4 py-1 text-sm font-semibold rounded-md ${activeTab === 'sell' ? 'bg-white shadow' : 'text-slate-600'}`}>팝니다</button>
                </div>
                <div className="relative flex-grow">
                    <input type="text" placeholder="상품권 검색..." className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"/>
                    <button className="absolute inset-y-0 right-0 px-3 text-slate-400">🔍</button>
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TradeItem type="sell" time="2시간 전" icon="🎫" name="스타벅스 기프트카드" amount="₩50,000 권" price="₩47,000에 판매" discount="6% 할인" seller="island***" rating="⭐⭐⭐⭐⭐" reviews="127" actionText="구매하기" />
                <TradeItem type="buy" time="1시간 전" icon="🍔" name="맥도날드 쿠폰" amount="₩10,000 권" price="₩9,500에 구매" discount="5% 프리미엄" seller="crypto***" rating="⭐⭐⭐⭐" reviews="89" actionText="판매하기" />
                <TradeItem type="sell" time="3시간 전" icon="🛍️" name="신세계 상품권" amount="₩100,000 권" price="₩95,000에 판매" discount="5% 할인" seller="trader***" rating="⭐⭐⭐⭐⭐" reviews="203" actionText="구매하기" />
                <TradeItem type="buy" time="4시간 전" icon="☕" name="투썸플레이스 쿠폰" amount="₩20,000 권" price="₩19,000에 구매" discount="5% 프리미엄" seller="coffee***" rating="⭐⭐⭐⭐" reviews="45" actionText="판매하기" />
            </div>
        </div>
    );
};

const TransferScreen = ({ setActiveScreen }: { setActiveScreen: (screen: Screen) => void }) => (
     <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center space-x-4">
            <button onClick={() => setActiveScreen('dashboard')} className="p-2 rounded-full hover:bg-slate-200 transition">
                <BackArrowIcon />
            </button>
            <h2 className="text-3xl font-bold text-slate-800">송금하기</h2>
        </div>
         <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
            <div>
                <label className="text-sm font-semibold text-slate-600">받는 사람</label>
                <div className="relative mt-1">
                     <input type="text" placeholder="지갑 주소 또는 사용자명 입력" className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"/>
                     <button className="absolute inset-y-0 right-0 px-3 text-slate-400">📷</button>
                </div>
            </div>
             <div>
                <label className="text-sm font-semibold text-slate-600">송금 금액</label>
                <div className="flex mt-1">
                    <input type="number" placeholder="0" className="w-full pl-4 py-2 rounded-l-lg border-t border-b border-l border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"/>
                    <select className="border-t border-b border-r border-slate-300 rounded-r-lg bg-slate-50 font-semibold text-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none">
                        <option>ISC</option>
                        <option>ETH</option>
                    </select>
                </div>
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">네트워크 수수료</span><span className="font-medium text-slate-700">0.001 ETH</span></div>
                <div className="flex justify-between font-bold"><span className="text-slate-800">총 금액</span><span className="text-teal-600">0 ISC</span></div>
            </div>
             <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-slate-300" disabled>송금하기</button>
        </div>
    </div>
);

const MiningScreen = ({ setActiveScreen }: { setActiveScreen: (screen: Screen) => void }) => {
    const [currentHash, setCurrentHash] = useState('');

    const generateHash = () => {
        const chars = 'abcdef0123456789';
        let hash = '0x';
        for (let i = 0; i < 40; i++) {
            hash += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return hash;
    };

    useEffect(() => {
        setCurrentHash(generateHash());
        const interval = setInterval(() => {
            setCurrentHash(generateHash());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    
    const mineableCoins = [
        { name: 'Coral Coin', symbol: 'CRC', icon: '🐚' },
        { name: 'Lagoon Token', symbol: 'LGN', icon: '💧' },
        { name: 'Tiki Token', symbol: 'TKI', icon: '🗿' },
        { name: 'Volcano Coin', symbol: 'VLC', icon: '🌋' },
        { name: 'Pearl Shard', symbol: 'PRL', icon: '⚪' },
        { name: 'Jungle Gem', symbol: 'JGL', icon: '🌳' },
        { name: 'Sunstone', symbol: 'SST', icon: '☀️' },
        { name: 'Aqua Ore', symbol: 'AQA', icon: '💎' },
    ];

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => setActiveScreen('dashboard')} className="p-2 rounded-full hover:bg-slate-200 transition">
                    <BackArrowIcon />
                </button>
                <h2 className="text-3xl font-bold text-slate-800">채굴 현황</h2>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-700">현재 해시값</h3>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">채굴 활성</span>
                    </div>
                </div>
                <div className="bg-slate-900 text-green-400 font-mono p-4 rounded-lg break-all text-sm">
                    {currentHash}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
                <h3 className="text-lg font-semibold text-slate-700">채굴 가능 코인 (8종)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mineableCoins.map(coin => (
                        <div key={coin.symbol} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg">
                            <div className="text-3xl">{coin.icon}</div>
                            <div>
                                <p className="font-bold text-slate-800">{coin.name}</p>
                                <p className="text-sm text-slate-500">{coin.symbol}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Navigation ---
const Navigation = ({ activeScreen, setActiveScreen }: { activeScreen: Screen, setActiveScreen: (screen: Screen) => void }) => {
    const navLinks: { id: Screen; label: string; }[] = [
        { id: 'dashboard', label: '대시보드' },
        { id: 'wallet', label: '월렛' },
        { id: 'p2p', label: 'P2P거래' },
    ];
    return (
        <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveScreen('dashboard')}>
                        <LogoIcon className="h-8" />
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map(link => (
                            <button
                                key={link.id}
                                onClick={() => setActiveScreen(link.id)}
                                className={`px-3 py-2 rounded-md text-sm font-semibold transition ${activeScreen === link.id ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                    <div className="hidden md:block">
                        <button onClick={() => setActiveScreen('auth')} className="px-3 py-2 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-100 transition">
                            로그아웃
                        </button>
                    </div>
                     <div className="md:hidden">
                        <button className="text-slate-600 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};


// --- Main App Component ---

const App = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('auth');

    const renderScreen = () => {
        switch (activeScreen) {
            case 'dashboard':
                return <DashboardScreen setActiveScreen={setActiveScreen} />;
            case 'wallet':
                return <WalletScreen />;
            case 'p2p':
                return <P2PScreen />;
            case 'transfer':
                return <TransferScreen setActiveScreen={setActiveScreen} />;
            case 'mining':
                return <MiningScreen setActiveScreen={setActiveScreen} />;
            case 'auth':
            default:
                return <AuthScreen onLogin={() => setActiveScreen('dashboard')} />;
        }
    };
    
    const showNav = activeScreen !== 'auth';

    return (
        <div className="min-h-screen bg-slate-100">
            {showNav && <Navigation activeScreen={activeScreen} setActiveScreen={setActiveScreen} />}
            <main className={showNav ? 'max-w-5xl mx-auto' : ''}>
                {renderScreen()}
            </main>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
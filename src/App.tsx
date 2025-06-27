import { Box } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lobby from "./pages/lobby/Lobby.tsx";
import Main from "./pages/Main.tsx";
import Game from "./pages/game/Game.tsx";

function App() {
    return (
        <Box p={4} height='100vh'>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/lobby/:gameId" element={<Lobby />} />
                    <Route path="/game/:gameId" element={<Game />} />
                </Routes>
            </BrowserRouter>
        </Box>
    );
}

export default App

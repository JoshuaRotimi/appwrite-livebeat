import { teams } from "./appwrite";


export async function getTeams () {
    const data = await teams.list();
    return {
        teams: data.teams
    }
}
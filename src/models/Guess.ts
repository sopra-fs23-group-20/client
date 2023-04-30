interface GuessData {
    userId: number | null;
    guess: string | null;
}


class Guess {
    userId: number | null;
    guess: string | null;

    constructor(
        data: GuessData = {
            userId: null,
            guess: null,
        }
    ) {
        this.userId = data.userId ?? null;
        this.guess = data.guess ?? null;
    }
}

export default Guess;
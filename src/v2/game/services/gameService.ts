export const sendSponsorsInfo = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "sendSponsors service error; getting sponsors info:\n" + error.message
      );
    }
  },
  addQuizCoins = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "addQuizCoins service error; adding coins earned from the quiz to the user:\n" +
          error.message
      );
    }
  };

export const sendBusinessesInfo = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "sendBusinessesInfo service error; getting businesses info:\n" +
          error.message
      );
    }
  },
  addMeetUp = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "addMeetUp service error; adding meetup answer to the user:\n" +
          error.message
      );
    }
  },
  sendBusinessChallengeWinners = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "sendBusinessChallengeWinners service error; getting business challenge winners:\n" +
          error.message
      );
    }
  };

export const sendRaffleInfo = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "sendRaffleInfo service error; getting raffle items info:\n" +
          error.message
      );
    }
  },
  sendRaffleIndicatorCoins = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "addMeetUp service error; getting the raffle coins indicators:\n" +
          error.message
      );
    }
  };

export const sendRaffleWinners = async () => {
  try {
    return null;
  } catch (error: any) {
    throw new Error(
      "sendRaffleWinners service error; setting the raffle winners:\n" +
        error.message
    );
  }
};

export const sendCoinsGainedHistory = async () => {
  try {
    return null;
  } catch (error: any) {
    throw new Error(
      "sendCoinsGainedHistory service error; getting the user's gained coins history:\n" +
        error.message
    );
  }
};

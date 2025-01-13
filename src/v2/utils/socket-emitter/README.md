
# Socket-Emitter Utility


The socket-emitter utility provides an easy way to manage real-time communication using Socket.IO in your backend and frontend applications. 
It allows for emitting messages to specific clients based on their connection IDs and supports a flexible approach to transforming data before sending it to clients.

This utility is designed to be used in a Node.js backend with Socket.IO and a React frontend for real-time communication.

## Summary of Parameters

### `target`  
- **Type**: `string`  
- **Required**: Yes  
- **Description**: The unique identifier (`clientId`) of the target client to send the message to.

---

### `data`  
- **Type**: `string | boolean | Array<string | boolean | any>`  
- **Required**: Yes  
- **Description**: The message or data to send to the target client. It can be a string, boolean, or an array containing strings, booleans, or any type.

---

### `event`
- **Type** `string`
- **Required**: Yes
- **Description**: The event name to emit to the target client. This is the event that the frontend will listen for.


---

### `transformData`  
- **Type**: `(data: string | boolean | Array<string | boolean | any>) => string | boolean | Array<string | boolean | any>`  
- **Required**: No  
- **Description**: A function to modify the data before sending it to the client (optional). The function should return the same type as `data`.


## Server-Side Usage
Suppose you want to reward a user with 10 coins when someone registers using their referral code. 
After successful registration, you will notify the user via Socket.IO.

```typescript
import { socketEmit } from "../utils/socketEmitter";

export const register = async (
  req: RegisterRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const { referralCode, ...userDetails } = req.body;

    const newUser = await authService.register(userDetails);

    if (referralCode) {
      const referredUser = await authService.getUserByReferralCode(referralCode);

      if (referredUser) {
        await authService.awardReferralCoins(referredUser.userId, 10);

        // Emit the data based on the specific event to the specified clientId
        // The event is what the client will listen on
        socketEmit.send({
          target: referredUser.clientId,
          event: 'referralBonus',
          data: {
            message: "You have earned 10 coins for referring a new user!"
          }
        });

        console.log(`Referred user ${referredUser.userId} has been awarded 10 coins.`);
      } else {
        console.log("Invalid referral code.");
      }
    }

    return res.status(201).json({
      message: "User was successfully registered. Verification email was sent successfully."
    });
  } catch (error: unknown) {
    next(error);
  }
};
```


 You can transform the data before sending it if needed using the transformData parameter.

```typescript
import { socketEmit } from './socketUtils';

const clientId = 'some-client-id';
const bonusData = { coins: 10, message: 'You earned 10 coins!' };

socketEmit.send({
  target: clientId,
  event: 'bonusUpdate',
  data: bonusData,
  transformData: (data) => {
    // Transform the data (optional)
    return { ...data, transformed: true };
  },
});
```



### Handling Real-Time Updates

## How It Works

1. **Client Registration:** When a client connects, they send their `clientId` to the server via the specified  event. The server maps the `clientId` to the socket ID.
2. **Real-Time Communication:** When an event occurs on the server (e.g., a user earns bonus coins), the server can emit the event to the client using their `clientId`. The data is sent in real-time.
3. **Data Transformation:** Optionally, data can be transformed before sending to the client by providing a `transformData` function.


### Scenario: Referral Bonus

- A user shares their referral code with a friend.
- When the friend uses the referral code, the server calculates the bonus (e.g., +10 coins).
- The server sends a real-time update to the user who owns the referral code, informing them of the bonus.
- The client (React app) receives this update and displays the new coin balance.


## Conclusion

This utility provides an easy-to-implement real-time socket-based communication solution for your applications. 
It supports both client and server-side communication, making it perfect for scenarios where users need to be updated in real-time (e.g., bonus notifications, referral rewards).

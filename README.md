# Launch my Ayala Parking App



## Full Stack

1. Launch the backend api. You can find it here: [https://github.com/Hoshaiah/ayala_parking](https://github.com/Hoshaiah/ayala_parking)

2. Clone the repo
```bash
git clone https://github.com/Hoshaiah/ayalaparking-frontend.git
cd ayalaparking-frontend
```
3. Change your server in based on the one that's being used for the backend api. 
##### ./src/constants/graphConstants.js
```javascript
const Constants = {
    server: 'http://127.0.0.1:3000'
}
```
4. Launch app :smile:
```bash
npm install
npm start
```


## Pure Frontend 
Check out the live demo of the app using only react in here [https://hoshaiah.github.io/ayalaparking-frontend/](https://hoshaiah.github.io/ayalaparking-frontend/) :smile:

For a pure frontend version, I've made a separate branch in this same repo: [https://github.com/Hoshaiah/ayalaparking-frontend/tree/pure-frontend](https://github.com/Hoshaiah/ayalaparking-frontend/tree/pure-frontend)

1. Clone the repo
```bash
git clone https://github.com/Hoshaiah/ayalaparking-frontend.git
cd ayalaparking-frontend
```

2. Switch to the pure-frontend branch
```bash
git fetch origin
git checkout -b pure-frontend origin/pure-frontend
```

3. Launch app :smile:
```
npm install
npm start
```

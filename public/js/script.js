const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', {
            latitude,
            longitude
        }, (error) => {

             console.log(error);
        },{
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 2000
        });
    });
}

const map = L.map("map").setView([0, 0],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© Raghavendra Kushtagi'
}).addTo(map);

const marker = {};

socket.on ('receive-location', (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 10);
    if (marker[id]) {
        marker[id].setLatLng([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
socket.on("user-disconnected", (id) => {
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});


// console.log("Verifying connection to server...");

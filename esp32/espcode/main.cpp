#include <WiFi.h>
#include <WebSocketClient.h>
#include "secrets.h"

WebSocketClient webSocket;

void setup() {
    Serial.begin(115200);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }

    Serial.println("Connected to WiFi!");
    webSocket.begin(SERVER_URL);
}

void loop() {
    webSocket.loop();

    if (webSocket.isConnected()) {
        // Simulate sending UID
        String uid = "123456";
        webSocket.sendData(uid);
        delay(5000); // Send UID every 5 seconds
    }
}

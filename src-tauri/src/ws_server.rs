use futures_util::{SinkExt, StreamExt};
use tokio::net::TcpListener;
use tokio::sync::broadcast;
use tokio_tungstenite::accept_async;

pub struct AppState {
    pub ws_sender: broadcast::Sender<String>,
}

pub fn spawn_server(tx_server: broadcast::Sender<String>) {
    tauri::async_runtime::spawn(async move {
        let addr = "127.0.0.1:48531";
        let listener = TcpListener::bind(&addr)
            .await
            .expect("Failed to bind WebSocket server");
        println!("WebSocket Server listening on: {}", addr);

        while let Ok((stream, _)) = listener.accept().await {
            let tx_client = tx_server.clone();

            tokio::spawn(async move {
                if let Ok(mut ws_stream) = accept_async(stream).await {
                    println!("Browser Extension Connected!");
                    let mut rx_channel = tx_client.subscribe();

                    loop {
                        tokio::select! {
                            Ok(msg) = rx_channel.recv() => {
                                if ws_stream.send(tokio_tungstenite::tungstenite::Message::Text(msg)).await.is_err() {
                                    break;
                                }
                            }
                            Some(Ok(_)) = ws_stream.next() => {
                              //
                            }
                            else => {
                                break;
                            }
                        }
                    }
                    println!("Browser Extension Disconnected.");
                }
            });
        }
    });
}

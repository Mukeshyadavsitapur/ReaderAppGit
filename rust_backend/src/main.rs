use axum::{
    routing::{get, post},
    Router,
    Json,
};
use serde::Serialize;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[derive(Serialize)]
struct HeathCheckResponse {
    status: String,
    message: String,
}

#[derive(Serialize)]
struct PerformanceData {
    cpu_usage: f32,
    memory_usage: f32,
    active_connections: u32,
}

#[tokio::main]
async fn main() {
    // Basic CORS setting to allow requests from the React Native app
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/performance", get(get_performance_data))
        .route("/api/process-text", post(process_text))
        .layer(cors);

    // Run the server on port 3030
    let addr = SocketAddr::from(([0, 0, 0, 0], 3030));
    println!("Backend server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> Json<HeathCheckResponse> {
    Json(HeathCheckResponse {
        status: "ok".to_string(),
        message: "Rust backend is running healthy!".to_string(),
    })
}

async fn get_performance_data() -> Json<PerformanceData> {
    // Simulated high-performance data generation
    Json(PerformanceData {
        cpu_usage: 12.5,
        memory_usage: 45.2,
        active_connections: 1337,
    })
}

#[derive(serde::Deserialize)]
struct TextProcessingRequest {
    text: String,
}

#[derive(Serialize)]
struct TextProcessingResponse {
    word_count: usize,
    char_count: usize,
    estimated_reading_time_seconds: u32,
    processed_status: String,
}

async fn process_text(Json(payload): Json<TextProcessingRequest>) -> Json<TextProcessingResponse> {
    // Here we offload heavy regex iterations or mappings from the JS thread.
    let word_count = payload.text.split_whitespace().count();
    let char_count = payload.text.chars().count();
    // Assuming 250 words per minute -> ~4 words per second
    let estimated_reading_time_seconds = (word_count as f32 / 4.16) as u32;

    Json(TextProcessingResponse {
        word_count,
        char_count,
        estimated_reading_time_seconds,
        processed_status: "success".to_string(),
    })
}

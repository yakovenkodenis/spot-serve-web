<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48"><defs><linearGradient id="a" gradientTransform="rotate(135)"><stop offset="0%"><animate attributeName="stop-color" values="#ff7eb3; #ff758c; #42a5f5; #ff7eb3" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"/></stop><stop offset="50%"><animate attributeName="stop-color" values="#ff758c; #42a5f5; #ff7eb3; #ff758c" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"/></stop><stop offset="100%"><animate attributeName="stop-color" values="#42a5f5; #ff7eb3; #ff758c; #42a5f5" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95;0.45 0.05 0.55 0.95"/></stop></linearGradient></defs><circle cx="32" cy="32" r="20" fill="none" stroke="url(#a)" opacity=".6"><animate attributeName="stroke-dashoffset" values="0;8" dur="2s" repeatCount="indefinite" calcMode="linear"/></circle><circle cx="32" cy="32" r="3" fill="url(#a)"/><circle cx="32" cy="12" r="2" fill="url(#a)"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="4s" repeatCount="indefinite" calcMode="linear"/></circle><path d="M32 29v6m-3-3h6" stroke="url(#a)"/></svg>
![svgviewer-output](https://github.com/user-attachments/assets/99c4bcb4-56a8-4864-acda-9fb67439af31)

# Spot Serve

Spot Serve is a seamless solution for developers to share quick, interactive previews of their websites. This app leverages modern technologies, including WebRTC, to allow for fast and secure file sharing directly from your local machine without relying on third-party hosting.

## Features
- Upload website files as a zip archive using the desktop app.
- Automatically generate a unique URL for others to view the website preview.
- Fast, secure file sharing powered by WebRTC technology.
- Simplified process for collaboration between developers, designers, and clients.
- No need for third-party hosting services.

## Installation

1. Clone the repository:
    ```bash
    git clone git@github.com:yakovenkodenis/spot-serve-web.git
    ```

2. Install dependencies (for both frontend and backend, if applicable):
    ```bash
    cd spot-serve-web
    yarn install
    ```

3. Run the app:
    ```bash
    yarn dev
    ```

## Usage

1. Upload your website files as a zip archive using [the desktop app](https://github.com/explicit-logic/spot-serve-gui).
2. Once uploaded, a unique URL will be generated.
3. Share this URL with others for them to preview your website.

## About Spot Serve

Spot Serve is designed with simplicity and performance in mind. It simplifies the process of showcasing a work-in-progress or delivering the final product to clients and collaborators. Powered by WebRTC, it ensures a hassle-free, direct preview experience every time.

## License

Spot Serve is licensed under the MIT License.

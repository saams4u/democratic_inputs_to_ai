# README

This README describes the web application built using Next.js, which is based on OpenAI's initiative titled "Democratic Inputs to AI". The website can be viewed [here](https://openai.com/blog/democratic-inputs-to-ai).

## Index.js File Overview

The `index.js` file serves as the main entry point for the application. It contains the `Home` component, which is the default function exported by the file. This function is a functional component that returns the JSX to be rendered on the home page of the application.

The `Home` component displays a welcome message about OpenAI's initiative and a collection of "stacks" or technologies, whose information is stored in a separate JSON file.

### Dependencies

This project uses the following external libraries:

- `next/link`: Used to create navigable links in the Next.js application without a full page refresh.
- `next/image`: Used for handling and optimizing images in the Next.js application.
- `iron-session`: Provides a middleware for session handling. It's useful for creating, reading, and managing user sessions in the application.
- `lowdb`: A small local JSON database powered by Lodash, which provides a set of utility functions for handling and manipulating data.
- `openai`: An official OpenAI client library for the OpenAI API. This allows the application to make use of OpenAI's AI models and services.

### Functionality

The `Home` function contains a sub-function `renderStacks` which maps over the keys of the `stacks` object (imported from `stacks.json`) and returns a `Link` component for each key. Each `Link` contains an `Image` component displaying the logo of the respective stack. The `Link` component takes a `href` prop which is the URL to navigate to when the component is clicked.

### Styling

Styling is accomplished with a mix of Tailwind CSS classes and inline styles:

- Tailwind CSS: Used for general layout and spacing, as well as some specific styles like border and roundness.
- Inline Styles: Used for more specific styling requirements like custom font size, font family, color, and text decoration.

## Stack Data

The `stacks` data is a JSON object where each key represents a unique identifier for a technology stack. Each key points to an object containing the following properties:

- `href`: A string that represents the URL to navigate to when the stack's logo is clicked.
- `hoverClass`: A string that determines the CSS class applied when the logo is hovered over.
- `logo`: A string that represents the URL of the logo image of the stack.
- `name`: A string that represents the name of the stack. It is used as the alt text for the image.

Please note that the JSON file is located in the `data` directory of the project root and is imported at the top of the `index.js` file.

## Running the App Locally

To run this app locally, you need to have Node.js and npm installed on your machine. Then, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory in the terminal.
3. Install the necessary dependencies with `npm install`.
4. Start the development server with `npm run dev`.

The application should now be running on `http://localhost:3000`.

## Contributing

If you wish to contribute to this project, please create a new branch for each feature or bug fix, commit your changes, and create a pull request for review.

## License

This project is licensed under the terms of the MIT license.
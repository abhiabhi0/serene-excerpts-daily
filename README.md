# Atmanam Viddhi - Know Thyself

## Project info

**URL**: https://lovable.dev/projects/53a94054-57ef-43cc-8207-e0135bc2c602

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/53a94054-57ef-43cc-8207-e0135bc2c602) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/53a94054-57ef-43cc-8207-e0135bc2c602) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## How to convert to android app

To run the app on Android, follow these steps:

First, make sure you have Android Studio installed on your computer. You can download it from: https://developer.android.com/studio

Git pull your project to get the latest changes:

```
git pull
```

Install the project dependencies:

```
npm install
```

Build your project:

```
npm run build
```

Add Android platform to your project:

```
npx cap add android
```

Sync your web code to your Android project:

```
npx cap sync
```

Open the project in Android Studio:

```
npx cap open android
```

In Android Studio:
Wait for the project to build
Connect your Android device via USB (make sure USB debugging is enabled) or start an emulator
Click the "Run" button (green play icon) to install and launch the app

Alternatively, after step 6, you can directly run on a connected device or emulator using:

```
npx cap run android
```

For more detailed information about running your app on a physical device and mobile capabilities, please read our blog post: https://lovable.dev/blogs/TODO

Remember to run `npx cap sync` whenever you make changes to your web code and want to update the Android app.

## Organize code in different branches

Here's what you need to do:

First, ensure all your changes are committed in the main branch
Create and switch to a new branch for the website:

```
git checkout -b website
git rm -r android/
git commit -m "Remove Android folder for website-only branch"
```

Switch back to main and create Android branch:

```
git checkout main
git checkout -b android
```

In the Android branch, you'll want to keep only the Android-specific code:

```
git rm -r src/
git rm -r public/
```

Keep only the necessary configuration files

```
git commit -m "Keep only Android-specific code"
```

Now you have three branches:

main: Contains all code (source of truth)
website: Website code without Android folder
android: Only Android-specific code and configurations

When you want to:

Add website-only features: Work in the website branch
Add Android-only features: Work in the android branch
Add features for both: Work in main and then merge into other branches

To merge changes from main to other branches:

```
git checkout website
git merge main --no-commit
git reset HEAD android/
git checkout -- android/
git commit -m "Merge from main, excluding android folder"
```
```
git checkout android
git merge main --no-commit
git reset HEAD src/ public/
git checkout -- src/ public/
git commit -m "Merge from main, keeping only android files"
```

No code changes are needed as this is purely a Git branching strategy. You can now manage features separately for web and Android versions.

## Deploy to Github Pages website
Here are the steps to deploy the website to a different GitHub account (atmanam):

First, build the static website:

```
npm run build
```

This will create a dist folder with the static files.

Create a new repository in the atmanam GitHub account named atmanam.github.io

Initialize git in the dist folder and push to the new repository:

```
cd dist
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/atmanam/atmanam.github.io.git
git push -u origin main
```
In the repository settings (https://github.com/atmanam/atmanam.github.io/settings/pages):

Go to "Pages" section
Under "Build and deployment", select:
Source: "Deploy from a branch"
Branch: "main"
Folder: "/" (root)
Click Save
The website will be deployed at https://atmanam.github.io
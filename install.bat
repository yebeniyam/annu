@echo off
echo Cleaning up previous installations...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo Installing dependencies...
call npm install --no-package-lock react@18.2.0 react-dom@18.2.0 react-router-dom@6.14.2
call npm install --no-package-lock @emotion/react@11.11.1 @emotion/styled@11.11.0
call npm install --no-package-lock @mui/material@5.14.5 @mui/icons-material@5.14.5
call npm install --no-package-lock axios@1.5.0 @supabase/supabase-js@2.58.0
call npm install --save-dev --no-package-lock @babel/core@7.22.10 @babel/preset-env@7.22.10 @babel/preset-react@7.22.5
call npm install --save-dev --no-package-lock babel-loader@9.1.3 css-loader@6.8.1 style-loader@3.3.3
call npm install --save-dev --no-package-lock webpack@5.88.2 webpack-cli@5.1.4 webpack-dev-server@4.15.1
call npm install --save-dev --no-package-lock html-webpack-plugin@5.5.3 concurrently@8.2.1

echo Installation complete!

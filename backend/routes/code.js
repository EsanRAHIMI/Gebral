// /Users/ehsanrahimi/Gabrel/app/backend/routes/code.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const backendRoot = path.resolve(__dirname, '../');
const frontendRoot = path.resolve(__dirname, '../../frontend');

const selectedFiles = [
    path.join(backendRoot, '.env'),
    path.join(backendRoot, 'server.js'),
    path.join(backendRoot, 'config.js'),
    path.join(backendRoot, 'routes', 'auth.js'),
    path.join(backendRoot, 'routes', 'tasks.js'),
    path.join(backendRoot, 'knexfile.js'),
    path.join(backendRoot, 'db', 'migrations', '20241228180000_create_enums.js'),
    path.join(backendRoot, 'db', 'migrations', '20250111200224_create_users_table.js'),
    path.join(backendRoot, 'db', 'migrations', '20250111200225_create_tasks_table.js'),
    path.join(backendRoot, 'db', 'migrations', '20250111200310_create_health_data_table.js'),
    path.join(frontendRoot, '.env'),
    path.join(frontendRoot, 'src', 'main.tsx'),
    path.join(frontendRoot, 'vite.config.ts'),
    path.join(frontendRoot, 'src', 'App.css'),
    path.join(frontendRoot, 'src', 'index.css'),
    path.join(frontendRoot, 'src', 'App.tsx'),
    path.join(frontendRoot, 'src', 'Dashboard.tsx'),
    path.join(frontendRoot, 'src', 'Login.tsx'),
    path.join(frontendRoot, 'src', 'Signup.tsx'),
    path.join(frontendRoot, 'src', 'tasks', 'TasksPage.tsx'),
    path.join(frontendRoot, 'src', 'tasks', 'tasks.components.tsx'),
    path.join(frontendRoot, 'src', 'tasks', 'tasks.hooks.ts'),
    path.join(frontendRoot, 'src', 'tasks', 'tasks.service.ts'),
    path.join(frontendRoot, 'src', 'tasks', 'tasks.styles.css'),
    path.join(frontendRoot, 'src', 'tasks', 'tasks.types.ts'),
    path.join(frontendRoot, 'src', 'tasks', 'tasks.utils.ts'),
    path.join(frontendRoot, 'src', 'tasks', 'index.ts')
];

const excludedDirs = ['node_modules', '.git', 'dist', 'build', 'coverage', '.DS_Store'];

const getDirectoryStructure = (dirPath) => {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    return files
        .filter(file => !excludedDirs.includes(file.name))
        .map(file => {
            const fullPath = path.join(dirPath, file.name);
            return file.isDirectory()
                ? { name: file.name, type: 'directory', children: getDirectoryStructure(fullPath) }
                : { name: file.name, type: 'file', path: fullPath };
        });
};

const generateTree = (nodes, prefix = '') => {
    return nodes
        .map((node, index, array) => {
            const isLast = index === array.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const subPrefix = prefix + (isLast ? '    ' : '│   ');

            if (node.type === 'directory') {
                return `${prefix}${connector}${node.name}/\n${generateTree(node.children, subPrefix)}`;
            } else {
                return `${prefix}${connector}${node.name}`;
            }
        })
        .join('\n');
};

router.get('/', async (req, res) => {
    try {
        const fileContents = selectedFiles.map(file => {
            try {
                if (!fs.existsSync(file)) {
                    console.warn(`File not found: ${file}`);
                    return { file: file, content: 'Error: File not found' };
                }
                return {
                    file: file,
                    content: fs.readFileSync(file, 'utf-8')
                };
            } catch (error) {
                console.error(`Error reading file: ${file}`, error);
                return { file: file, content: 'Error: Cannot read file' };
            }
        });

        let backendTree = 'Error: Could not load backend directory';
        let frontendTree = 'Error: Could not load frontend directory';

        try {
            const backendStructure = getDirectoryStructure(backendRoot);
            backendTree = generateTree(backendStructure, '');
        } catch (error) {
            console.error('Error generating backend directory tree:', error);
        }

        try {
            const frontendStructure = getDirectoryStructure(frontendRoot);
            frontendTree = generateTree(frontendStructure, '');
        } catch (error) {
            console.error('Error generating frontend directory tree:', error);
        }

        const projectTree = `backend/\n${backendTree}\nfrontend/\n${frontendTree}`;

        res.json({ files: fileContents, directoryTree: projectTree });
    } catch (err) {
        res.status(500).json({ error: 'Error processing request', details: err.message });
    }
});

module.exports = router;

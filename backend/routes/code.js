const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// مسیرهای پروژه
const backendRoot = path.resolve(__dirname, '../');
const frontendRoot = path.resolve(__dirname, '../../frontend');

// لیست فایل‌های انتخاب‌شده برای نمایش
const selectedFiles = [
    path.join(backendRoot, 'server.js'),
    path.join(backendRoot, 'config.js'),
    path.join(frontendRoot, 'vite.config.ts'),
    path.join(frontendRoot, 'src', 'App.tsx')
];

// دایرکتوری‌های ناخواسته که باید فیلتر شوند
const excludedDirs = ['node_modules', '.git', 'dist', 'build', 'coverage','.DS_Store'];

// تابع بازگشتی برای دریافت ساختار دایرکتوری به‌صورت آبجکت
const getDirectoryStructure = (dirPath) => {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    return files
        .filter(file => !excludedDirs.includes(file.name)) // فیلتر دایرکتوری‌های ناخواسته
        .map(file => {
            const fullPath = path.join(dirPath, file.name);
            return file.isDirectory()
                ? { name: file.name, type: 'directory', children: getDirectoryStructure(fullPath) }
                : { name: file.name, type: 'file', path: fullPath };
        });
};

// تابعی برای تولید خروجی درختی
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
            if (!fs.existsSync(file)) {
                throw new Error(`File not found: ${file}`);
            }
            return {
                file: file, // نمایش مسیر کامل فایل
                content: fs.readFileSync(file, 'utf-8')
            };
        });

        // دریافت ساختار کل پروژه
        const backendStructure = getDirectoryStructure(backendRoot);
        const frontendStructure = getDirectoryStructure(frontendRoot);

        // تولید ساختار درختی برای نمایش
        const backendTree = generateTree(backendStructure, '');
        const frontendTree = generateTree(frontendStructure, '');

        const projectTree = `backend/\n${backendTree}\nfrontend/\n${frontendTree}`;

        res.json({ files: fileContents, directoryTree: projectTree });
    } catch (err) {
        res.status(500).json({ error: 'Error reading files', details: err.message });
    }
});

module.exports = router;

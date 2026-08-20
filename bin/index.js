#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { confirm, select } = require("@inquirer/prompts");


const args = process.argv.slice(2);

const FLAGS = {
    dryRun: args.includes("--dry-run") || args.includes("-d"),
    force: args.includes("--force") || args.includes("-f"),
    yes: args.includes("--yes") || args.includes("-y")
};

const positional = args.filter(
    arg =>
        !arg.startsWith("--") &&
        !["-d", "-f", "-y"].includes(arg)
);

// ============================================================
// UI
// ============================================================

function printHeader(title = "Krishna Kit") {
    console.log("");
    console.log(`🚀 ${title}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
}

async function installBootstrap(destinationRoot) {
    console.log("");

    const choice = await select({
        message: "What do you want to install?",
        choices: [
            {
                name: "Bootstrap",
                value: "bootstrap",
                description: "Bootstrap CSS + JavaScript"
            },
            {
                name: "Bootstrap + Icons",
                value: "bootstrap-icons",
                description: "Bootstrap CSS + JavaScript + Bootstrap Icons"
            },
            {
                name: "Bootstrap Icons only",
                value: "icons",
                description: "Bootstrap Icons only"
            },
            {
                name: "Nothing",
                value: "nothing",
                description: "Continue without Bootstrap"
            }
        ]
    });

    if (choice === "nothing") {
        return;
    }

    const packages = [];

    if (
        choice === "bootstrap" ||
        choice === "bootstrap-icons"
    ) {
        packages.push("bootstrap");
    }

    if (
        choice === "bootstrap-icons" ||
        choice === "icons"
    ) {
        packages.push("bootstrap-icons");
    }

    if (!packages.length) {
        return;
    }

    console.log("");
    console.log(
        `📦 Installing ${packages.join(" + ")}...`
    );

    try {
        const { execSync } = require("child_process");

        execSync(
            `npm install ${packages.join(" ")}`,
            {
                cwd: destinationRoot,
                stdio: "inherit"
            }
        );

        console.log("");
        console.log("✅ Dependencies installed successfully.");
    } catch (error) {
        console.log("");
        console.log(
            "❌ Failed to install dependencies."
        );

        console.log(
            "   Run npm install manually inside the project."
        );
    }
}

function copyTemplate(templateRoot, destinationRoot) {
    if (!fs.existsSync(templateRoot)) {
        throw new Error(
            "Template folder was not found."
        );
    }

    if (fs.existsSync(destinationRoot)) {
        throw new Error(
            `Project folder already exists: ${destinationRoot}`
        );
    }

    ensureDirectory(destinationRoot);

    function copyRecursive(source, destination) {
        const items = fs.readdirSync(source);

        for (const item of items) {
            const sourcePath = path.join(source, item);
            const destinationPath = path.join(
                destination,
                item
            );

            const stat = fs.lstatSync(sourcePath);

            if (stat.isDirectory()) {
                ensureDirectory(destinationPath);
                copyRecursive(
                    sourcePath,
                    destinationPath
                );
            } else {
                ensureDirectory(
                    path.dirname(destinationPath)
                );

                fs.copyFileSync(
                    sourcePath,
                    destinationPath
                );
            }
        }
    }

    copyRecursive(
        templateRoot,
        destinationRoot
    );
}

async function createProject(projectName) {
    const destinationRoot =
        resolveFolder(projectName);

    const templateRoot =
        path.join(
            __dirname,
            "..",
            "template"
        );

    printHeader();

    console.log(
        "📁 Creating project structure..."
    );

    console.log("");

    copyTemplate(
        templateRoot,
        destinationRoot
    );

    console.log(
        "✅ Project structure created successfully!"
    );

    await installBootstrap(
        destinationRoot
    );

    console.log("");
    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log(
        "🎉 Krishna Kit setup complete!"
    );

    console.log("");
    console.log("Next steps:");
    console.log("");
    console.log(`   cd ${projectName}`);
    console.log("   npm install");
    console.log("");
    console.log("Happy Coding ❤️");
}

function usage() {
    printHeader();

    console.log("Project organization & maintenance CLI");
    console.log("");

    console.log("Usage:");
    console.log("");
    console.log("  npx krishna-kit my-project ./existing-folder");
    console.log("  npx krishna-kit organize ./project");
    console.log("");

    console.log("Commands:");
    console.log("");
    console.log("  organize <folder>       Organize project files");
    console.log("  analyze <folder>        Analyze project");
    console.log("  doctor <folder>         Check project health");
    console.log("  duplicates <folder>     Find duplicate files");
    console.log("  clean <folder>          Clean temporary/build files");
    console.log("  readme <folder>         Generate README");
    console.log("");

    console.log("Options:");
    console.log("");
    console.log("  --dry-run, -d           Preview changes without modifying files");
    console.log("  --force, -f             Overwrite conflicting files");
    console.log("  --yes, -y               Skip confirmation prompts");
    console.log("  --version, -v           Show version");
    console.log("  --help, -h              Show help");
    console.log("");
}

// ============================================================
// PATH / FILESYSTEM
// ============================================================

function resolveFolder(input) {
    return path.resolve(process.cwd(), input || ".");
}

function ensureDirectory(directory) {
    fs.mkdirSync(directory, {
        recursive: true
    });
}

function safeRelative(from, to) {
    return path.relative(from, to) || ".";
}

function isInside(parent, child) {
    const relative = path.relative(parent, child);

    return (
        relative &&
        !relative.startsWith("..") &&
        !path.isAbsolute(relative)
    );
}

function validateFolder(folder) {
    if (!fs.existsSync(folder)) {
        throw new Error(`Folder does not exist: ${folder}`);
    }

    if (!fs.statSync(folder).isDirectory()) {
        throw new Error(`Path is not a folder: ${folder}`);
    }
}

// ============================================================
// FILE SCANNER
// ============================================================

function getFiles(directory, options = {}) {
    const results = [];

    const ignoredFolders = new Set([
        "node_modules",
        ".git",
        ".svn",
        ".hg",
        "dist",
        "build",
        ".next",
        "coverage",
        ".cache",
        ...(options.ignoredFolders || [])
    ]);

    function scan(current) {
        if (!fs.existsSync(current)) {
            return;
        }

        for (const item of fs.readdirSync(current)) {
            if (ignoredFolders.has(item)) {
                continue;
            }

            const fullPath = path.join(current, item);
            const stat = fs.lstatSync(fullPath);

            if (stat.isDirectory()) {
                scan(fullPath);
            } else if (stat.isFile()) {
                results.push(fullPath);
            }
        }
    }

    scan(directory);

    return results;
}

// ============================================================
// FILE CLASSIFICATION
// ============================================================

function classifyFile(filePath) {
    const name = path.basename(filePath);
    const lower = name.toLowerCase();
    const ext = path.extname(name).toLowerCase();

    // Files that should remain in project root
    const rootFiles = new Set([
        "index.html",
        "package.json",
        "package-lock.json",
        "npm-shrinkwrap.json",
        "pnpm-lock.yaml",
        "yarn.lock",
        "readme.md",
        "license",
        "license.md",
        ".gitignore",
        ".npmrc",
        ".env",
        ".env.example"
    ]);

    if (rootFiles.has(lower)) {
        return "";
    }

    // HTML
    if ([".html", ".htm"].includes(ext)) {
        return "Src/Pages";
    }

    // CSS
    if (
        [".css", ".scss", ".sass", ".less", ".styl"].includes(ext)
    ) {
        return "Src/CSS";
    }

    // Images
    if (
        [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".svg",
            ".ico",
            ".bmp",
            ".avif"
        ].includes(ext)
    ) {
        return "Public/Images";
    }

    // Videos
    if (
        [
            ".mp4",
            ".webm",
            ".mov",
            ".avi",
            ".mkv",
            ".m4v"
        ].includes(ext)
    ) {
        return "Public/Videos";
    }

    // Audio
    if (
        [
            ".mp3",
            ".wav",
            ".ogg",
            ".m4a",
            ".aac",
            ".flac"
        ].includes(ext)
    ) {
        return "Public/Audio";
    }

    // Fonts
    if (
        [
            ".woff",
            ".woff2",
            ".ttf",
            ".otf",
            ".eot"
        ].includes(ext)
    ) {
        return "Public/Fonts";
    }

    // Documents
    if (
        [
            ".pdf",
            ".doc",
            ".docx",
            ".xls",
            ".xlsx",
            ".ppt",
            ".pptx",
            ".txt",
            ".csv"
        ].includes(ext)
    ) {
        return "Public/Doc";
    }

    // JavaScript / TypeScript
    if (
        [
            ".js",
            ".jsx",
            ".mjs",
            ".cjs",
            ".ts",
            ".tsx"
        ].includes(ext)
    ) {
        const baseName = path.parse(name).name;

        // React hooks
        if (/^use[A-Z_]/.test(name)) {
            return "Src/Hooks";
        }

        // Services / APIs
        if (
            /(^api$|api$|service$|services$)/i.test(baseName)
        ) {
            return "Src/Services";
        }

        // Config
        if (/config$/i.test(baseName)) {
            return "Src/Config";
        }

        // React components
        if (
            [".jsx", ".tsx"].includes(ext) &&
            /^[A-Z]/.test(name)
        ) {
            return "Src/Components";
        }

        return "Src/JS";
    }

    // JSON / YAML
    if (
        [".json", ".yaml", ".yml"].includes(ext)
    ) {
        if (
            [
                "package.json",
                "package-lock.json"
            ].includes(lower)
        ) {
            return "";
        }

        return "Src/Config";
    }

    // Archives
    if (
        [".zip", ".rar", ".7z", ".tar", ".gz"].includes(ext)
    ) {
        return "Public/Archives";
    }

    // Other programming languages
    if ([".php"].includes(ext)) {
        return "Src/PHP";
    }

    if ([".py"].includes(ext)) {
        return "Src/Python";
    }

    if ([".java"].includes(ext)) {
        return "Src/Java";
    }

    if ([".c"].includes(ext)) {
        return "Src/C";
    }

    if ([".cpp", ".cc", ".cxx"].includes(ext)) {
        return "Src/Cpp";
    }

    if ([".cs"].includes(ext)) {
        return "Src/CSharp";
    }

    if ([".go"].includes(ext)) {
        return "Src/Go";
    }

    if ([".rs"].includes(ext)) {
        return "Src/Rust";
    }

    if ([".rb"].includes(ext)) {
        return "Src/Ruby";
    }

    // Unknown files
    return "Public";
}

// ============================================================
// DUPLICATE / CONFLICT HANDLING
// ============================================================

function hashFile(filePath) {
    return crypto
        .createHash("sha256")
        .update(fs.readFileSync(filePath))
        .digest("hex");
}

function uniqueTarget(targetFile) {
    if (!fs.existsSync(targetFile)) {
        return targetFile;
    }

    const directory = path.dirname(targetFile);
    const extension = path.extname(targetFile);
    const base = path.basename(
        targetFile,
        extension
    );

    let index = 1;
    let candidate;

    do {
        candidate = path.join(
            directory,
            `${base}-${index}${extension}`
        );

        index++;
    } while (fs.existsSync(candidate));

    return candidate;
}

function getConflictTarget(
    sourceFile,
    targetFile,
    force
) {
    // No conflict
    if (!fs.existsSync(targetFile)) {
        return {
            target: targetFile,
            action: "create"
        };
    }

    // Same file content
    try {
        if (
            hashFile(sourceFile) ===
            hashFile(targetFile)
        ) {
            return {
                target: targetFile,
                action: "skip"
            };
        }
    } catch { }

    // Force overwrite
    if (force) {
        return {
            target: targetFile,
            action: "overwrite"
        };
    }

    // Safe rename
    return {
        target: uniqueTarget(targetFile),
        action: "rename"
    };
}

// ============================================================
// ORGANIZER
// ============================================================

function buildOrganizationPlan(
    sourceRoot,
    destinationRoot,
    options = {}
) {
    const files = getFiles(sourceRoot);

    const operations = [];

    for (const file of files) {
        // Prevent destination from being scanned if it is
        // accidentally inside source.
        if (
            path
                .resolve(file)
                .startsWith(
                    path.resolve(destinationRoot) +
                    path.sep
                )
        ) {
            continue;
        }

        const relativeSource = safeRelative(
            sourceRoot,
            file
        );

        const folder = classifyFile(file);

        const targetFolder = path.join(
            destinationRoot,
            folder
        );

        const initialTarget = path.join(
            targetFolder,
            path.basename(file)
        );

        const conflict = getConflictTarget(
            file,
            initialTarget,
            options.force
        );

        operations.push({
            source: file,
            sourceRelative: relativeSource,

            target: conflict.target,
            targetRelative: safeRelative(
                destinationRoot,
                conflict.target
            ),

            action: conflict.action
        });
    }

    return operations;
}

function printOperations(operations) {
    const counts = {
        create: 0,
        rename: 0,
        overwrite: 0,
        skip: 0
    };

    for (const operation of operations) {
        counts[operation.action]++;

        let symbol = "→";

        if (operation.action === "rename") {
            symbol = "↪";
        }

        if (operation.action === "overwrite") {
            symbol = "⚠";
        }

        if (operation.action === "skip") {
            symbol = "=";
        }

        console.log(
            `   ${symbol} ${operation.sourceRelative} → ${operation.targetRelative} [${operation.action.toUpperCase()}]`
        );
    }

    console.log("");

    console.log(
        `Summary: ${counts.create} new, ` +
        `${counts.rename} renamed, ` +
        `${counts.overwrite} overwritten, ` +
        `${counts.skip} unchanged`
    );
}

function executeOrganization(operations) {
    let processed = 0;

    for (const operation of operations) {
        if (operation.action === "skip") {
            console.log(
                `   = ${operation.sourceRelative} → ${operation.targetRelative} [UNCHANGED]`
            );

            continue;
        }

        ensureDirectory(
            path.dirname(operation.target)
        );

        fs.copyFileSync(
            operation.source,
            operation.target
        );

        let label = "";

        if (operation.action === "rename") {
            label = "[RENAMED]";
        }

        if (operation.action === "overwrite") {
            label = "[OVERWRITTEN]";
        }

        console.log(
            `   ✓ ${operation.sourceRelative} → ${operation.targetRelative} ${label}`
        );

        processed++;
    }

    return processed;
}

async function organizeCommand(
    sourceRoot,
    destinationRoot,
    options = {}
) {
    validateFolder(sourceRoot);

    if (
        path.resolve(sourceRoot) ===
        path.resolve(destinationRoot)
    ) {
        throw new Error(
            "Source and destination cannot be the same folder."
        );
    }

    if (
        isInside(
            sourceRoot,
            destinationRoot
        )
    ) {
        throw new Error(
            "Destination cannot be inside the source folder."
        );
    }

    const files = getFiles(sourceRoot);

    if (!files.length) {
        console.log("⚠️ No files found.");
        return;
    }

    console.log(
        `🔍 Found ${files.length} file(s).`
    );

    console.log("");

    const operations =
        buildOrganizationPlan(
            sourceRoot,
            destinationRoot,
            {
                force: options.force
            }
        );

    printOperations(operations);

    // Dry run
    if (options.dryRun) {
        console.log("");
        console.log(
            "ℹ️ Dry run complete. No files were changed."
        );

        return;
    }

    // Confirmation
    if (!options.yes) {
        const changes = operations.filter(
            operation =>
                operation.action !== "skip"
        ).length;

        const proceed = await confirm({
            message:
                `Organize ${changes} file(s)?`,
            default: true
        });

        if (!proceed) {
            console.log(
                "❌ Operation cancelled."
            );

            return;
        }
    }

    console.log("");
    console.log("📁 Organizing files...");
    console.log("");

    ensureDirectory(destinationRoot);

    const processed =
        executeOrganization(
            operations
        );

    console.log("");
    console.log(
        `✅ ${processed} file(s) processed.`
    );

    // Ask for optional Bootstrap installation
    await installBootstrap(destinationRoot);
}

// ============================================================
// PROJECT ANALYZER
// ============================================================

function formatBytes(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 ** 2) {
        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }

    if (bytes < 1024 ** 3) {
        return `${(
            bytes / 1024 ** 2
        ).toFixed(1)} MB`;
    }

    return `${(
        bytes / 1024 ** 3
    ).toFixed(1)} GB`;
}

function getFileStats(root) {
    const files = getFiles(root);

    let totalBytes = 0;

    const extensions = {};
    const folders = {};
    const largest = [];

    for (const file of files) {
        const stat = fs.statSync(file);

        const ext =
            path.extname(file).toLowerCase() ||
            "[no extension]";

        const relative =
            safeRelative(root, file);

        const topFolder =
            relative.split(path.sep)[0];

        totalBytes += stat.size;

        extensions[ext] =
            (extensions[ext] || 0) + 1;

        folders[topFolder] =
            (folders[topFolder] || 0) + 1;

        largest.push({
            file,
            size: stat.size
        });
    }

    largest.sort(
        (a, b) => b.size - a.size
    );

    return {
        files,
        totalBytes,
        extensions,
        folders,
        largest: largest.slice(0, 10)
    };
}

function detectProjectType(root) {
    const packageFile =
        path.join(
            root,
            "package.json"
        );

    if (fs.existsSync(packageFile)) {
        try {
            const pkg = JSON.parse(
                fs.readFileSync(
                    packageFile,
                    "utf8"
                )
            );

            const dependencies = {
                ...(pkg.dependencies || {}),
                ...(pkg.devDependencies || {})
            };

            if (
                dependencies.react ||
                dependencies["react-dom"]
            ) {
                return "React";
            }

            if (dependencies.next) {
                return "Next.js";
            }

            if (dependencies.express) {
                return "Node.js / Express";
            }

            if (
                dependencies.typescript ||
                fs.existsSync(
                    path.join(
                        root,
                        "tsconfig.json"
                    )
                )
            ) {
                return "TypeScript";
            }

            return "Node.js";
        } catch {
            return "JavaScript";
        }
    }

    if (
        fs.existsSync(
            path.join(
                root,
                "index.html"
            )
        )
    ) {
        return "HTML / CSS / JavaScript";
    }

    return "Unknown";
}

function analyzeDependencies(root) {
    const packageFile =
        path.join(
            root,
            "package.json"
        );

    if (!fs.existsSync(packageFile)) {
        return;
    }

    try {
        const pkg = JSON.parse(
            fs.readFileSync(
                packageFile,
                "utf8"
            )
        );

        const dependencies =
            Object.keys(
                pkg.dependencies || {}
            );

        const devDependencies =
            Object.keys(
                pkg.devDependencies || {}
            );

        console.log("");
        console.log("📦 Dependencies");

        console.log(
            `   Production: ${dependencies.length}`
        );

        console.log(
            `   Development: ${devDependencies.length}`
        );

        if (dependencies.length) {
            console.log(
                `   ${dependencies.join(", ")}`
            );
        }
    } catch {
        console.log(
            "⚠️ package.json could not be parsed."
        );
    }
}

function analyzeCommand(root) {
    validateFolder(root);

    const stats =
        getFileStats(root);

    const type =
        detectProjectType(root);

    printHeader(
        "Project Analyzer"
    );

    console.log(
        `📁 Project: ${path.basename(root)}`
    );

    console.log(
        `🧩 Type: ${type}`
    );

    console.log("");

    console.log("📊 Statistics");

    console.log(
        `   Files: ${stats.files.length}`
    );

    console.log(
        `   Size: ${formatBytes(
            stats.totalBytes
        )}`
    );

    console.log("");

    console.log("📄 File Types");

    Object.entries(
        stats.extensions
    )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .forEach(
            ([ext, count]) => {
                console.log(
                    `   ${ext.padEnd(
                        15
                    )} ${count}`
                );
            }
        );

    console.log("");

    console.log("📂 Top Folders");

    Object.entries(
        stats.folders
    )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .slice(0, 10)
        .forEach(
            ([folder, count]) => {
                console.log(
                    `   ${folder.padEnd(
                        20
                    )} ${count}`
                );
            }
        );

    console.log("");

    console.log("🐘 Largest Files");

    stats.largest
        .slice(0, 5)
        .forEach(item => {
            console.log(
                `   ${formatBytes(
                    item.size
                ).padStart(
                    10
                )}  ${safeRelative(
                    root,
                    item.file
                )}`
            );
        });

    analyzeDependencies(root);
}

// ============================================================
// DUPLICATE FINDER
// ============================================================

function findDuplicates(root) {
    const files =
        getFiles(root);

    const groups =
        new Map();

    for (const file of files) {
        try {
            const stat =
                fs.statSync(file);

            const hash =
                hashFile(file);

            const key =
                `${stat.size}:${hash}`;

            if (!groups.has(key)) {
                groups.set(
                    key,
                    []
                );
            }

            groups
                .get(key)
                .push(file);
        } catch { }
    }

    return [...groups.values()]
        .filter(
            group =>
                group.length > 1
        );
}

function duplicatesCommand(root) {
    validateFolder(root);

    printHeader(
        "Duplicate Finder"
    );

    const duplicates =
        findDuplicates(root);

    if (!duplicates.length) {
        console.log(
            "✅ No duplicate files found."
        );

        return;
    }

    let total = 0;

    duplicates.forEach(
        (group, index) => {
            console.log(
                `🔁 Group ${index + 1}`
            );

            group.forEach(file => {
                console.log(
                    `   ${safeRelative(
                        root,
                        file
                    )}`
                );

                total++;
            });

            console.log("");
        }
    );

    console.log(
        `Found ${duplicates.length} duplicate group(s).`
    );

    console.log(
        `Total duplicate copies: ${total - duplicates.length
        }`
    );
}

// ============================================================
// PROJECT DOCTOR
// ============================================================

function doctorCommand(root) {
    validateFolder(root);

    printHeader(
        "Project Doctor"
    );

    let score = 100;

    const issues = [];
    const recommendations = [];

    const packageFile =
        path.join(
            root,
            "package.json"
        );

    const indexFile =
        path.join(
            root,
            "index.html"
        );

    const readmeFile =
        path.join(
            root,
            "README.md"
        );

    const gitFolder =
        path.join(
            root,
            ".git"
        );

    // package.json
    if (fs.existsSync(packageFile)) {
        try {
            JSON.parse(
                fs.readFileSync(
                    packageFile,
                    "utf8"
                )
            );

            console.log(
                "✓ Valid package.json"
            );
        } catch {
            console.log(
                "✗ Invalid package.json"
            );

            score -= 20;

            issues.push(
                "package.json contains invalid JSON"
            );
        }
    } else {
        console.log(
            "⚠ package.json missing"
        );

        score -= 10;

        issues.push(
            "package.json is missing"
        );
    }

    // index.html
    if (fs.existsSync(indexFile)) {
        console.log(
            "✓ index.html found"
        );
    } else {
        console.log(
            "⚠ index.html not found"
        );

        score -= 5;

        issues.push(
            "index.html is missing"
        );
    }

    // Git
    if (fs.existsSync(gitFolder)) {
        console.log(
            "✓ Git repository"
        );
    } else {
        console.log(
            "⚠ Git repository not initialized"
        );

        score -= 5;

        recommendations.push(
            "Initialize Git"
        );
    }

    // README
    if (fs.existsSync(readmeFile)) {
        console.log(
            "✓ README.md found"
        );
    } else {
        console.log(
            "⚠ README.md missing"
        );

        score -= 5;

        recommendations.push(
            "Generate README"
        );
    }

    // Duplicates
    const duplicates =
        findDuplicates(root);

    if (duplicates.length) {
        console.log(
            `⚠ ${duplicates.length} duplicate group(s)`
        );

        score -= Math.min(
            15,
            duplicates.length * 2
        );

        issues.push(
            `${duplicates.length} duplicate file group(s) found`
        );

        recommendations.push(
            "Remove duplicate files"
        );
    } else {
        console.log(
            "✓ No duplicate files"
        );
    }

    // Large files
    const stats =
        getFileStats(root);

    const largeFiles =
        stats.largest.filter(
            item =>
                item.size >
                10 * 1024 * 1024
        );

    if (largeFiles.length) {
        console.log(
            `⚠ ${largeFiles.length} file(s) larger than 10 MB`
        );

        score -= Math.min(
            10,
            largeFiles.length * 2
        );

        issues.push(
            `${largeFiles.length} large file(s) detected`
        );

        recommendations.push(
            "Review large assets"
        );
    } else {
        console.log(
            "✓ No unusually large files"
        );
    }

    console.log("");

    console.log(
        `🩺 Project Health: ${Math.max(
            0,
            score
        )}/100`
    );

    console.log("");

    if (issues.length) {
        console.log("⚠ Issues");

        issues.forEach(issue => {
            console.log(
                `   • ${issue}`
            );
        });

        console.log("");
    }

    if (recommendations.length) {
        console.log(
            "💡 Recommendations"
        );

        recommendations.forEach(
            recommendation => {
                console.log(
                    `   • ${recommendation}`
                );
            }
        );
    } else {
        console.log(
            "🎉 No major issues found."
        );
    }
}

// ============================================================
// CLEANER
// ============================================================

function removeEmptyDirectories(
    root
) {
    let removed = 0;

    function walk(directory) {
        if (!fs.existsSync(directory)) {
            return;
        }

        const entries =
            fs.readdirSync(
                directory
            );

        for (const entry of entries) {
            const fullPath =
                path.join(
                    directory,
                    entry
                );

            if (
                fs.existsSync(fullPath) &&
                fs.lstatSync(
                    fullPath
                ).isDirectory()
            ) {
                walk(fullPath);
            }
        }

        if (
            directory !== root &&
            fs.existsSync(directory) &&
            fs.readdirSync(
                directory
            ).length === 0
        ) {
            fs.rmdirSync(
                directory
            );

            removed++;
        }
    }

    walk(root);

    return removed;
}

function cleanCommand(
    root,
    options = {}
) {
    validateFolder(root);

    printHeader(
        "Project Cleaner"
    );

    const temporaryExtensions =
        new Set([
            ".tmp",
            ".temp",
            ".log",
            ".bak",
            ".swp"
        ]);

    const temporaryNames =
        new Set([
            ".DS_Store",
            "Thumbs.db",
            "desktop.ini"
        ]);

    const buildFolders =
        new Set([
            "dist",
            "build",
            ".cache",
            ".parcel-cache",
            ".next",
            "coverage"
        ]);

    const files =
        getFiles(root);

    const removableFiles =
        files.filter(file => {
            const name =
                path.basename(file);

            const ext =
                path.extname(
                    name
                ).toLowerCase();

            return (
                temporaryNames.has(
                    name
                ) ||
                temporaryExtensions.has(
                    ext
                )
            );
        });

    const emptyFolders = [];

    function scanEmpty(directory) {
        for (
            const item of fs.readdirSync(
                directory
            )
        ) {
            if (
                [
                    "node_modules",
                    ".git"
                ].includes(item)
            ) {
                continue;
            }

            const full =
                path.join(
                    directory,
                    item
                );

            if (
                fs.lstatSync(
                    full
                ).isDirectory()
            ) {
                scanEmpty(full);

                if (
                    fs.readdirSync(
                        full
                    ).length === 0
                ) {
                    emptyFolders.push(
                        full
                    );
                }
            }
        }
    }

    scanEmpty(root);

    const buildPaths = [];

    function scanBuild(directory) {
        for (
            const item of fs.readdirSync(
                directory
            )
        ) {
            if (
                [
                    "node_modules",
                    ".git"
                ].includes(item)
            ) {
                continue;
            }

            const full =
                path.join(
                    directory,
                    item
                );

            if (
                fs.lstatSync(
                    full
                ).isDirectory()
            ) {
                if (
                    buildFolders.has(
                        item
                    )
                ) {
                    buildPaths.push(
                        full
                    );

                    continue;
                }

                scanBuild(full);
            }
        }
    }

    scanBuild(root);

    console.log(
        `🧹 Temporary files: ${removableFiles.length}`
    );

    console.log(
        `📂 Empty folders: ${emptyFolders.length}`
    );

    console.log(
        `🏗️ Build/cache folders: ${buildPaths.length}`
    );

    console.log("");

    if (
        !removableFiles.length &&
        !emptyFolders.length &&
        !buildPaths.length
    ) {
        console.log(
            "✅ Nothing to clean."
        );

        return;
    }

    if (options.dryRun) {
        console.log(
            "Preview:"
        );

        removableFiles.forEach(
            file => {
                console.log(
                    `   🗑 ${safeRelative(
                        root,
                        file
                    )}`
                );
            }
        );

        emptyFolders.forEach(
            folder => {
                console.log(
                    `   📂 ${safeRelative(
                        root,
                        folder
                    )}`
                );
            }
        );

        buildPaths.forEach(
            folder => {
                console.log(
                    `   🏗 ${safeRelative(
                        root,
                        folder
                    )}`
                );
            }
        );

        console.log("");

        console.log(
            "ℹ️ Dry run complete. Nothing was deleted."
        );

        return;
    }

    let removed = 0;

    removableFiles.forEach(
        file => {
            fs.rmSync(
                file,
                {
                    force: true
                }
            );

            removed++;
        }
    );

    buildPaths.forEach(
        folder => {
            fs.rmSync(
                folder,
                {
                    recursive: true,
                    force: true
                }
            );

            removed++;
        }
    );

    const emptyRemoved =
        removeEmptyDirectories(
            root
        );

    removed += emptyRemoved;

    console.log(
        `✅ Cleaned ${removed} item(s).`
    );
}

// ============================================================
// README GENERATOR
// ============================================================

function generateReadme(root) {
    validateFolder(root);

    printHeader(
        "README Generator"
    );

    const packageFile =
        path.join(
            root,
            "package.json"
        );

    const readmeFile =
        path.join(
            root,
            "README.md"
        );

    let pkg = {};

    if (fs.existsSync(packageFile)) {
        try {
            pkg = JSON.parse(
                fs.readFileSync(
                    packageFile,
                    "utf8"
                )
            );
        } catch { }
    }

    const stats =
        getFileStats(root);

    const type =
        detectProjectType(root);

    const technologies =
        Object.keys({
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {})
        });

    const projectName =
        pkg.name ||
        path.basename(root);

    const content = `# ${projectName}

## Description

${pkg.description || "Project organized with Krishna Kit."}

## Project Type

${type}

## Technologies

${technologies.length
            ? technologies
                .map(
                    item => `- ${item}`
                )
                .join("\n")
            : "- HTML\n- CSS\n- JavaScript"
        }

## Project Statistics

- Files: ${stats.files.length}
- Total size: ${formatBytes(
            stats.totalBytes
        )}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

Add your project usage instructions here.

## Project Structure

Add your project structure here.

## Author

${pkg.author || "Project Author"}

## License

${pkg.license || "MIT"}
`;

    fs.writeFileSync(
        readmeFile,
        content
    );

    console.log(
        `✅ README generated: ${readmeFile}`
    );
}

// ============================================================
// BACKWARD COMPATIBILITY
// ============================================================

async function legacyOrganize(
    projectName,
    sourcePath
) {
    const destination =
        resolveFolder(
            projectName
        );

    validateFolder(
        sourcePath
    );

    if (
        fs.existsSync(
            destination
        )
    ) {
        throw new Error(
            `Destination folder already exists: ${destination}`
        );
    }

    await organizeCommand(
        sourcePath,
        destination,
        FLAGS
    );
}

// ============================================================
// MAIN
// ============================================================

async function main() {
    if (
        args.includes("--help") ||
        args.includes("-h") ||
        positional.length === 0
    ) {
        usage();
        return;
    }

    if (
        args.includes("--version") ||
        args.includes("-v")
    ) {
        console.log(
            VERSION
        );

        return;
    }

    const command =
        positional[0];

    const commands = [
        "organize",
        "analyze",
        "doctor",
        "duplicates",
        "clean",
        "readme"
    ];

    // New command style
    if (
        commands.includes(command)
    ) {
        const folder =
            resolveFolder(
                positional[1] || "."
            );

        switch (command) {
            case "organize": {
                const destination =
                    positional[2]
                        ? resolveFolder(
                            positional[2]
                        )
                        : path.join(
                            folder,
                            "krishna-kit-organized"
                        );

                await organizeCommand(
                    folder,
                    destination,
                    FLAGS
                );

                break;
            }

            case "analyze":
                analyzeCommand(
                    folder
                );
                break;

            case "doctor":
                doctorCommand(
                    folder
                );
                break;

            case "duplicates":
                duplicatesCommand(
                    folder
                );
                break;

            case "clean":
                cleanCommand(
                    folder,
                    FLAGS
                );
                break;

            case "readme":
                generateReadme(
                    folder
                );
                break;
        }

        return;
    }

    // Existing syntax:
    // Existing project organization
    if (positional.length >= 2) {
        await legacyOrganize(
            positional[0],
            resolveFolder(positional[1])
        );

        return;
    }

    // Create new project from template
    if (positional.length === 1) {
        await createProject(
            positional[0]
        );

        return;
    }

    usage();

    console.log("");

    console.log(
        "Example:"
    );

    console.log(
        "  npx krishna-kit my-project ./existing-folder"
    );

    console.log("");
}

// ============================================================
// ERROR HANDLING
// ============================================================

main().catch(error => {
    console.log("");
    console.log(
        "❌ Something went wrong"
    );

    console.log(
        `   ${error.message}`
    );

    console.log("");

    if (
        error.name ===
        "ExitPromptError"
    ) {
        console.log(
            "Operation cancelled."
        );

        console.log("");
    }

    process.exit(1);
});
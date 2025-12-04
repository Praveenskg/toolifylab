# Contributing to ToolifyLab

Thank you for your interest in contributing to ToolifyLab! 🎉

We welcome contributions from developers of all skill levels. Whether you're
fixing bugs, adding features, improving documentation, or helping with testing,
your contributions are valuable to us and the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting Issues](#reporting-issues)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Contributing Guidelines](#contributing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Types of Contributions](#types-of-contributions)
- [Recognition](#recognition)

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a
welcoming environment for all contributors. By participating, you agree to
uphold this code.

## Reporting Issues

We use GitHub Issues to track bugs, feature requests, and general questions. To
help us respond efficiently, please use the appropriate issue template:

### 🐛 Bug Reports

Found a bug? Use the
[Bug Report template](https://github.com/praveenskg/toolifylab/issues/new?template=bug-report.yml)
and provide:

- Tool name and version information
- Steps to reproduce the issue
- Expected vs. actual behavior
- Browser, OS, and device details
- Screenshots or console errors (if applicable)

### ✨ Feature Requests

Have an idea for a new tool or feature? Use the
[Feature Request template](https://github.com/praveenskg/toolifylab/issues/new?template=feature-request.yml)
and include:

- Clear problem statement
- Proposed solution with details
- Alternative approaches considered
- Use cases or examples

### 📚 Documentation Issues

Issues with documentation? Use the
[Documentation template](https://github.com/praveenskg/toolifylab/issues/new?template=documentation.yml)
for:

- Outdated information
- Missing instructions
- Unclear explanations
- Broken links or examples

### ❓ Questions & Support

Need help or have a question? Use the
[Question template](https://github.com/praveenskg/toolifylab/issues/new?template=question.yml)
for:

- How-to questions
- Technical inquiries
- Setup assistance
- General support

### 🔒 Security Issues

**Never report security vulnerabilities through public GitHub issues.** Email
[security@toolifylab.com](mailto:security@toolifylab.com) directly instead.

### Issue Guidelines

- **Search First**: Check if the issue already exists before creating a new one
- **Be Specific**: Provide detailed information to help us understand and
  reproduce issues
- **One Issue Per Report**: Create separate issues for different problems
- **Stay Updated**: Follow your issue for updates and provide additional
  information if requested

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm**, **yarn**, or **pnpm** package manager
- **Git** for version control

### Quick Setup

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/toolifylab.git

# Navigate to the project directory
cd toolifylab

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see ToolifyLab running
locally!

## Development Setup

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/praveenskg/toolifylab.git
   cd toolifylab
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier

# Git Hooks
npm run prepare      # Set up Husky
npm run pre-commit   # Run pre-commit hooks
```

## Project Structure

```
toolifylab/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [tool]/            # Individual tool pages
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── tools/             # Tool-specific components
│   │   └── homepage/          # Homepage components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities and configurations
├── public/                    # Static assets
├── types/                     # TypeScript type definitions
├── .github/                   # GitHub templates and workflows
├── components.json            # Shadcn/ui configuration
└── tailwind.config.ts         # Tailwind CSS configuration
```

## Development Workflow

### 1. Choose an Issue

- Check the [Issues](https://github.com/praveenskg/toolifylab/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/issue-number-description
```

### 3. Make Changes

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run linting and type checking
npm run lint
npm run type-check

# Build the project to ensure it works
npm run build
```

### 5. Submit a Pull Request

- Push your branch to GitHub
- Create a Pull Request with a clear description
- Reference any related issues
- Request review from maintainers

## Contributing Guidelines

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Follows Next.js and React best practices
- **Prettier**: Automatic code formatting
- **Imports**: Use absolute imports with `@/` prefix

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

Examples:

```
feat: add dark mode toggle
fix: resolve mobile layout issue in calculator
docs: update API documentation
```

### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why, not how
- **Screenshots**: Include for UI changes
- **Testing**: Describe how to test the changes
- **Breaking Changes**: Clearly mark any breaking changes

### Code Review Process

1. **Automated Checks**: CI/CD runs linting, testing, and builds
2. **Peer Review**: At least one maintainer reviews the code
3. **Approval**: Maintainers approve and merge
4. **Deployment**: Changes are automatically deployed

## Submitting Changes

### For New Tools

1. **Create Component**: Add to `src/components/tools/`
2. **Add Page**: Create `src/app/[tool-name]/page.tsx`
3. **Update Config**: Add to `src/lib/tools.ts`
4. **Add Tests**: Create component tests
5. **Update Docs**: Add to README and tool documentation

### For Bug Fixes

1. **Reproduce**: Confirm the bug exists
2. **Fix**: Implement the solution
3. **Test**: Ensure fix works and doesn't break other features
4. **Document**: Update relevant documentation

### For Documentation

1. **Identify**: Find what needs updating
2. **Update**: Make changes to relevant files
3. **Verify**: Check links and formatting
4. **Preview**: Test documentation renders correctly

## Types of Contributions

### 🐛 Bug Fixes

Fix existing issues and improve stability

### ✨ Features

Add new functionality and tools

### 📚 Documentation

Improve guides, README, and code comments

### 🧪 Testing

Add or improve test coverage

### 🎨 UI/UX

Enhance user interface and experience

### 🌐 Internationalization

Add language support and translations

### 🛠️ Tools & Infrastructure

Improve build tools, scripts, and development experience

### 📊 Analytics & Monitoring

Add performance monitoring and analytics

## Recognition

Contributors are recognized in several ways:

- **Contributors List**: Added to repository contributors
- **Changelog**: Featured in release notes
- **Social Media**: Featured on our social channels
- **Special Mentions**: Highlighted for significant contributions

### Hall of Fame

We maintain a special recognition for contributors who have made outstanding
contributions:

- **🏆 Tool Creator**: Created a major tool or feature
- **🎯 Bug Hunter**: Fixed critical bugs or security issues
- **📖 Documentation Hero**: Significantly improved documentation
- **🧪 Testing Champion**: Added comprehensive test coverage
- **🌟 Community Builder**: Helped grow and support the community

## Getting Help

Need help with contributing?

- **📖 Documentation**: Check the [README](README.md) and
  [Wiki](https://github.com/praveenskg/toolifylab/wiki)
- **💬 Discussions**: Ask questions in
  [GitHub Discussions](https://github.com/praveenskg/toolifylab/discussions)
- **🐛 Issues**: Create issues for bugs or feature requests
- **📧 Email**: Contact maintainers at
  [contribute@toolifylab.com](mailto:contribute@toolifylab.com)

## License

By contributing to ToolifyLab, you agree that your contributions will be
licensed under the same [MIT License](LICENSE) that covers the project.

---

Thank you for contributing to ToolifyLab! Your efforts help make powerful tools
accessible to everyone. 🚀

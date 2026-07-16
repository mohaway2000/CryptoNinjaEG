# Contributing Guide

Thank you for your interest in contributing to this project! We welcome contributions from everyone.

## Getting Started

1. **Fork the repository** — Click the fork button on GitHub
2. **Clone your fork** — `git clone https://github.com/YOUR-USERNAME/CryptoNinjaEG.git`
3. **Create a branch** — `git checkout -b feature/your-feature-name`
4. **Make changes** — Implement your improvements
5. **Test thoroughly** — Ensure all code works as expected
6. **Commit & push** — Follow commit conventions below
7. **Open a pull request** — Describe your changes clearly

## Commit Message Convention

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, missing semicolons)
- **refactor:** Code refactoring without feature/fix
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Build, dependencies, tooling
- **ci:** CI/CD configuration

### Examples
```
feat(bot): add price alert functionality
fix(webhook): handle null payload gracefully
docs: update installation instructions
chore(deps): upgrade express to v4.19.0
```

## Code Standards

### JavaScript/Node.js
- Use ES6+ features
- Use `const` by default, `let` for reassignment
- Use arrow functions
- Add comments for complex logic
- Follow the existing code style

### Python
- Follow PEP 8 style guide
- Use type hints where possible
- Write docstrings for functions
- Use meaningful variable names

### General
- Keep functions small and focused
- Write self-documenting code
- Remove console.log/print statements in production code
- No hardcoded secrets or credentials

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage
- Test edge cases and error scenarios

## Security

- Never commit secrets or API keys
- Always use environment variables for sensitive data
- Validate and sanitize all inputs
- Report security issues privately (see SECURITY.md)

## Pull Request Process

1. **Update README.md** — If adding features, update documentation
2. **Add tests** — Include tests for new functionality
3. **Update CHANGELOG** — Document your changes
4. **Follow conventions** — Use commit message standards above
5. **Keep it focused** — One feature per PR
6. **Be responsive** — Address feedback promptly

## Questions?

Feel free to:
- Open an issue for discussions
- Contact: mohaway2000@gmail.com
- DM on Telegram: https://t.me/mohaway2000

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

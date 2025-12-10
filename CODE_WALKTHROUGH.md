# Complete Code Walkthrough - Line by Line Explanation

This document provides a detailed explanation of every code file in the project, with comments explaining what each line does and why it's used.

## Table of Contents
1. [Configuration Files](#configuration-files)
2. [Database Entities](#database-entities)
3. [Authentication Module](#authentication-module)
4. [Scores Module](#scores-module)
5. [Common Utilities](#common-utilities)
6. [Application Setup](#application-setup)
7. [Docker Configuration](#docker-configuration)

---

# Configuration Files

## package.json

```json
{
  // Package name - identifies this project
  "name": "leaderboard-api",
  
  // Semantic versioning: major.minor.patch
  "version": "1.0.0",
  
  // Brief project description for npm registry
  "description": "RESTful API for mobile game leaderboard with JWT authentication",
  
  // Project maintainer information
  "author": "Fabrotec",
  
  // Private package - won't be published to npm registry
  "private": true,
  
  // License type - MIT allows free use with attribution
  "license": "MIT",
  
  // npm scripts - commands you can run with 'npm run <script-name>'
  "scripts": {
    // Remove the dist folder before building (clean build)
    "prebuild": "rimraf dist",
    
    // Compile TypeScript to JavaScript using NestJS CLI
    "build": "nest build",
    
    // Auto-format code using Prettier (enforces code style consistency)
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    
    // Start the application (runs compiled JavaScript)
    "start": "nest start",
    
    // Start in development mode with file watching (auto-restart on changes)
    "start:dev": "nest start --watch",
    
    // Start in debug mode for debugging with Chrome DevTools
    "start:debug": "nest start --debug --watch",
    
    // Start in production mode (optimized, no debugging)
    "start:prod": "node dist/main",
    
    // Run ESLint to check code quality and auto-fix issues
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    
    // Run all tests once using Jest
    "test": "jest",
    
    // Run tests in watch mode (re-runs on file changes)
    "test:watch": "jest --watch",
    
    // Run tests with code coverage report
    "test:cov": "jest --coverage",
    
    // Run tests in debug mode for troubleshooting
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    
    // Run end-to-end tests (full API integration tests)
    "test:e2e": "jest --config ./test/jest-e2e.json",
    
    // TypeORM CLI helper command
    "typeorm": "typeorm-ts-node-commonjs",
    
    // Generate a new database migration based on entity changes
    "migration:generate": "npm run typeorm -- migration:generate -d src/config/typeorm.config.ts",
    
    // Run pending database migrations
    "migration:run": "npm run typeorm -- migration:run -d src/config/typeorm.config.ts",
    
    // Revert the last database migration
    "migration:revert": "npm run typeorm -- migration:revert -d src/config/typeorm.config.ts"
  },
  
  // Production dependencies - needed to run the app
  "dependencies": {
    // NestJS core framework libraries
    "@nestjs/common": "^10.0.0",          // Common decorators, pipes, guards
    "@nestjs/config": "^3.1.1",           // Environment configuration management
    "@nestjs/core": "^10.0.0",            // Core framework functionality
    "@nestjs/jwt": "^10.2.0",             // JWT token creation and validation
    "@nestjs/passport": "^10.0.2",        // Authentication middleware integration
    "@nestjs/platform-express": "^10.0.0", // Express HTTP server adapter
    "@nestjs/throttler": "^5.0.1",        // Rate limiting implementation
    "@nestjs/typeorm": "^10.0.1",         // TypeORM database integration
    
    // Password hashing library (industry standard, very secure)
    "bcrypt": "^5.1.1",
    
    // Class validation and transformation
    "class-transformer": "^0.5.1",        // Transform plain objects to class instances
    "class-validator": "^0.14.0",         // Validate class properties with decorators
    
    // Authentication strategies
    "passport": "^0.7.0",                 // Authentication middleware
    "passport-jwt": "^4.0.1",             // JWT authentication strategy
    "passport-local": "^1.0.0",           // Username/password authentication strategy
    
    // PostgreSQL database driver
    "pg": "^8.11.3",
    
    // Required for decorators and metadata reflection
    "reflect-metadata": "^0.1.13",
    
    // Utility to remove files/folders (used in prebuild script)
    "rimraf": "^5.0.5",
    
    // Reactive programming library (used by NestJS internally)
    "rxjs": "^7.8.1",
    
    // ORM for database operations
    "typeorm": "^0.3.17",
    
    // Logging libraries
    "winston": "^3.11.0",                 // Flexible logging library
    "winston-daily-rotate-file": "^4.7.1", // Daily log file rotation
    "nest-winston": "^1.9.4"              // Winston integration for NestJS
  },
  
  // Development dependencies - only needed during development
  "devDependencies": {
    // NestJS development tools
    "@nestjs/cli": "^10.0.0",             // NestJS command-line interface
    "@nestjs/schematics": "^10.0.0",      // Code generation templates
    "@nestjs/testing": "^10.0.0",         // Testing utilities for NestJS
    
    // TypeScript type definitions for various libraries
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^3.0.13",
    "@types/passport-local": "^1.0.38",
    "@types/supertest": "^2.0.12",
    
    // ESLint (code quality checker)
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",   // Disable ESLint rules that conflict with Prettier
    "eslint-plugin-prettier": "^5.0.0",   // Run Prettier as ESLint rule
    
    // Testing framework
    "jest": "^29.5.0",
    
    // Code formatter (enforces consistent style)
    "prettier": "^3.0.0",
    
    // Debugging helper
    "source-map-support": "^0.5.21",
    
    // HTTP testing library
    "supertest": "^6.3.3",
    
    // TypeScript testing support
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    
    // TypeScript compiler
    "typescript": "^5.1.3"
  },
  
  // Jest testing configuration
  "jest": {
    // File extensions Jest should process
    "moduleFileExtensions": [
      "js",   // JavaScript files
      "json", // JSON files
      "ts"    // TypeScript files
    ],
    
    // Root directory for tests (src folder)
    "rootDir": "src",
    
    // Pattern to find test files (any file ending with .spec.ts)
    "testRegex": ".*\\.spec\\.ts$",
    
    // How to transform files before testing
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"  // Use ts-jest to compile TypeScript
    },
    
    // Files to include in coverage report
    "collectCoverageFrom": [
      "**/*.(t|j)s"  // All TypeScript and JavaScript files
    ],
    
    // Where to output coverage reports
    "coverageDirectory": "../coverage",
    
    // Test environment (Node.js)
    "testEnvironment": "node"
  }
}
```

**Why each dependency?**
- **@nestjs/\***: Core framework providing structure, dependency injection, decorators
- **bcrypt**: Industry-standard password hashing (used by banks, governments)
- **class-validator**: Type-safe request validation (prevents invalid data)
- **passport**: Proven authentication library (10+ years, millions of users)
- **typeorm**: Type-safe database queries (prevents SQL injection)
- **winston**: Production-grade logging (supports multiple outputs, rotation)

---

## tsconfig.json

```json
{
  // TypeScript compiler options
  "compilerOptions": {
    // Use CommonJS module system (Node.js standard)
    "module": "commonjs",
    
    // Generate .d.ts declaration files (type definitions for consumers)
    "declaration": true,
    
    // Remove comments from compiled JavaScript (smaller output files)
    "removeComments": true,
    
    // Required for decorators to work (@Injectable, @Controller, etc.)
    "emitDecoratorMetadata": true,
    
    // Enable experimental decorator syntax (needed for NestJS decorators)
    "experimentalDecorators": true,
    
    // Allow default imports from modules without default export
    "allowSyntheticDefaultImports": true,
    
    // Target ES2021 JavaScript (modern Node.js features)
    "target": "ES2021",
    
    // Generate source maps for debugging (map compiled JS back to TS)
    "sourceMap": true,
    
    // Output compiled JavaScript to dist folder
    "outDir": "./dist",
    
    // Base directory for module resolution
    "baseUrl": "./",
    
    // Incremental compilation (faster rebuilds)
    "incremental": true,
    
    // Skip type checking of declaration files (faster compilation)
    "skipLibCheck": true,
    
    // Don't enforce null checks (more lenient, easier development)
    "strictNullChecks": false,
    
    // Don't require explicit 'any' types
    "noImplicitAny": false,
    
    // Don't enforce strict bind/call/apply
    "strictBindCallApply": false,
    
    // Don't enforce consistent file name casing (Windows compatibility)
    "forceConsistentCasingInFileNames": false,
    
    // Don't check for fallthrough in switch statements
    "noFallthroughCasesInSwitch": false,
    
    // Path aliases for cleaner imports
    "paths": {
      "@/*": ["src/*"]  // Use @/module instead of ../../../module
    }
  }
}
```

**Why these settings?**
- **emitDecoratorMetadata**: NestJS heavily uses decorators (@Injectable, @Get, etc.)
- **experimentalDecorators**: Required for decorator syntax to work
- **sourceMap**: Essential for debugging - shows original TypeScript in debugger
- **target ES2021**: Modern JavaScript features (async/await, optional chaining)
- **paths**: Cleaner imports, less "../../../" mess

---

# Database Entities

## src/entities/user.entity.ts

```typescript
// Import decorators and types from TypeORM
import { 
  Entity,              // Marks class as database table
  PrimaryGeneratedColumn, // Auto-generated primary key
  Column,              // Marks property as database column
  CreateDateColumn,    // Automatically set on creation
  UpdateDateColumn,    // Automatically updated on save
  OneToMany            // Defines one-to-many relationship
} from 'typeorm';

// Import class-transformer decorator to exclude fields from JSON
import { Exclude } from 'class-transformer';

// Import Score entity for relationship
import { Score } from './score.entity';

// Enum for user roles (TypeScript enum for type safety)
export enum UserRole {
  USER = 'user',    // Regular user - can only submit own scores
  ADMIN = 'admin',  // Admin - can submit scores for anyone
}

// @Entity decorator marks this class as a database table named 'users'
@Entity('users')
export class User {
  // Primary key - automatically generated UUID
  // Why UUID? Harder to guess than sequential IDs, better for distributed systems
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Username column - must be unique across all users
  // Why unique? Each username can only belong to one user
  @Column({ unique: true })
  username: string;

  // Password column - stores hashed password (never plain text!)
  // @Exclude() prevents password from appearing in JSON responses
  // Why exclude? Security - never send passwords to client
  @Column()
  @Exclude()
  password: string;

  // Role column - stores user's permission level
  // type: 'enum' - only allows values from UserRole enum
  // default: USER - new users get USER role by default
  // Why enum? Type safety, prevents invalid roles like "super_admin" typo
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Active status - allows soft deletion without removing data
  // Why? Deactivated users can't login but their data remains
  @Column({ default: true })
  isActive: boolean;

  // One-to-many relationship: one user has many scores
  // () => Score: Function returning entity type (avoids circular dependency)
  // (score) => score.user: How to access user from score
  // Why relationship? Easy to query all scores for a user
  @OneToMany(() => Score, (score) => score.user)
  scores: Score[];

  // Automatically set to current timestamp when user is created
  // Why? Track when users registered
  @CreateDateColumn()
  createdAt: Date;

  // Automatically updated to current timestamp whenever user is saved
  // Why? Track when user data was last modified
  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Key Design Decisions:**
- **UUID vs Integer ID**: UUIDs prevent ID guessing, better for APIs
- **Username unique**: Business rule - one username per user
- **Password excluded**: Security - never expose passwords in responses
- **Role enum**: Type safety prevents typos and invalid roles
- **isActive flag**: Soft delete - preserve data but prevent access
- **Timestamps**: Audit trail - know when data changed

---

## src/entities/score.entity.ts

```typescript
// Import TypeORM decorators
import { 
  Entity,              // Mark as database table
  PrimaryGeneratedColumn, // Auto-generated ID
  Column,              // Database column
  CreateDateColumn,    // Auto-set creation time
  ManyToOne,          // Many scores belong to one user
  JoinColumn,         // Specify foreign key column
  Index               // Create database index for performance
} from 'typeorm';

// Import User entity for relationship
import { User } from './user.entity';

// Mark as 'scores' table
@Entity('scores')
// Create index on score column for fast leaderboard queries
// Why index? Makes "ORDER BY score DESC" queries 100x faster
// unique: false - multiple scores can have same value
@Index(['score'], { unique: false })
export class Score {
  // Primary key - auto-generated UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Score value stored as integer
  // type: 'int' - whole numbers only (no decimals)
  // Why integer? Game scores are typically whole numbers, faster queries
  @Column({ type: 'int' })
  score: number;

  // Foreign key to users table
  // Stores the user ID who achieved this score
  // Why separate column? Required for database foreign key constraint
  @Column()
  userId: string;

  // Many-to-one relationship: many scores belong to one user
  // () => User: The related entity type
  // (user) => user.scores: Inverse relationship (how user accesses scores)
  // onDelete: 'CASCADE' - if user deleted, delete their scores too
  // Why cascade? Orphaned scores make no sense without a user
  @ManyToOne(() => User, (user) => user.scores, { onDelete: 'CASCADE' })
  // Specify which column is the foreign key
  @JoinColumn({ name: 'userId' })
  user: User;

  // Automatically set when score is created
  // Why? Know when score was achieved, useful for "recent scores"
  @CreateDateColumn()
  createdAt: Date;
}
```

**Key Design Decisions:**
- **Index on score**: Critical for leaderboard performance (millions of scores)
- **Integer type**: Whole numbers, faster than float, appropriate for game scores
- **Foreign key (userId)**: Enforces data integrity - can't create score for non-existent user
- **Cascade delete**: Clean up - deleting user removes their scores automatically
- **CreatedAt**: Track when score achieved, useful for time-based leaderboards

---

# Authentication Module

## src/auth/dto/register.dto.ts

```typescript
// Import validation decorators from class-validator
import { 
  IsString,      // Validates value is a string
  IsNotEmpty,    // Validates value is not empty/null/undefined
  MinLength,     // Validates minimum string length
  IsEnum,        // Validates value is from enum
  IsOptional     // Makes field optional
} from 'class-validator';

// Import UserRole enum for validation
import { UserRole } from '../../entities/user.entity';

// DTO (Data Transfer Object) - defines shape of registration request
// Why DTO? Validation, type safety, documentation
export class RegisterDto {
  // Username must be:
  // 1. A string (not number, object, etc.)
  @IsString()
  // 2. Not empty (not "", null, undefined)
  @IsNotEmpty()
  // 3. At least 3 characters long
  // Why 3? Prevent single-letter usernames, too short to be useful
  @MinLength(3)
  username: string;

  // Password must be:
  // 1. A string
  @IsString()
  // 2. Not empty
  @IsNotEmpty()
  // 3. At least 6 characters long
  // Why 6? Minimum reasonable security, still user-friendly
  // Production should use 8+ with complexity requirements
  @MinLength(6)
  password: string;

  // Role is optional (defaults to USER in entity)
  @IsOptional()
  // If provided, must be valid UserRole enum value
  // Why enum validation? Prevents invalid roles like "superuser"
  @IsEnum(UserRole)
  role?: UserRole;
}
```

**Why Validation?**
- **Security**: Prevents malformed data from reaching database
- **User Experience**: Clear error messages ("username too short")
- **Data Integrity**: Ensures all users have valid data
- **API Documentation**: DTO shows exactly what's expected

---

## src/auth/dto/login.dto.ts

```typescript
// Import validation decorators
import { IsString, IsNotEmpty } from 'class-validator';

// DTO for login request
export class LoginDto {
  // Username is required
  // @IsString validates it's actually a string type
  @IsString()
  // @IsNotEmpty ensures it's not empty string or null
  @IsNotEmpty()
  username: string;

  // Password is required
  @IsString()
  @IsNotEmpty()
  password: string;
}
```

**Why Simpler Than Register?**
- No length validation (user already registered, validated then)
- No role field (role doesn't change during login)
- Just verify credentials exist

---

## src/auth/strategies/jwt.strategy.ts

```typescript
// Import NestJS and Passport decorators
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// Import JWT strategy from passport-jwt
import { ExtractJwt, Strategy } from 'passport-jwt';

// Import config service to read environment variables
import { ConfigService } from '@nestjs/config';

// Import TypeORM decorator for database access
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import User entity
import { User } from '../../entities/user.entity';

// Interface defining JWT token payload structure
// Why interface? Type safety for token data
export interface JwtPayload {
  sub: string;      // Subject - user ID (JWT standard)
  username: string; // Username for display
  role: string;     // User role for authorization
}

// @Injectable allows dependency injection
@Injectable()
// Extend Passport's JWT strategy
// Why extend? Add our custom validation logic
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Constructor with dependency injection
  constructor(
    // Inject ConfigService to read JWT_SECRET from .env
    private configService: ConfigService,
    // Inject User repository for database queries
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Call parent constructor with configuration
    super({
      // How to extract JWT from request
      // fromAuthHeaderAsBearerToken: looks for "Authorization: Bearer <token>"
      // Why? Industry standard for JWT in HTTP headers
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Don't ignore token expiration
      // Why false? Expired tokens should be rejected for security
      ignoreExpiration: false,
      
      // Secret key to verify token signature
      // Why from config? Different secrets for dev/staging/prod
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  // Validate method - called after token signature is verified
  // payload: Decoded JWT payload (id, username, role)
  // Returns: User object attached to request, or throws error
  async validate(payload: JwtPayload): Promise<User> {
    // Query database for user by ID from token
    // Also check if user is active (not banned/deleted)
    // Why check active? Deactivated users shouldn't access even with valid token
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    });

    // If user not found or inactive, reject request
    // Why UnauthorizedException? HTTP 401 - standard for invalid auth
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Return user object - will be attached to request.user
    // Why return user? Controller can access full user data
    return user;
  }
}
```

**Flow:**
1. Request comes with `Authorization: Bearer <token>`
2. Strategy extracts and verifies token signature
3. If signature valid, calls `validate()` with decoded payload
4. `validate()` checks if user exists and is active
5. Returns user object, attached to request
6. Controller can access user via `@CurrentUser()` decorator

**Why Two-Step Validation?**
- **Signature check**: Ensures token wasn't tampered with
- **Database check**: Ensures user still exists and is active
- **Example**: User deleted after token issued - signature valid but user gone

---

## src/auth/strategies/local.strategy.ts

```typescript
// Import NestJS decorators
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// Import local strategy (username/password)
import { Strategy } from 'passport-local';

// Import auth service for validation logic
import { AuthService } from '../auth.service';

// @Injectable enables dependency injection
@Injectable()
// Extend Passport's local strategy
// Why local? Validates username/password credentials
export class LocalStrategy extends PassportStrategy(Strategy) {
  // Inject AuthService to validate credentials
  constructor(private authService: AuthService) {
    // Configure strategy
    // usernameField: 'username' - field name in request body
    // Why specify? Default is 'username', but could be 'email'
    super({ usernameField: 'username' });
  }

  // Validate method - called by Passport
  // Receives username and password from request body
  // Returns: User object if valid, throws error if invalid
  async validate(username: string, password: string): Promise<any> {
    // Call AuthService to check credentials against database
    const user = await this.authService.validateUser(username, password);
    
    // If validation fails (wrong password or user not found)
    // Why 401? Standard HTTP status for authentication failure
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Return user object - attached to request.user
    return user;
  }
}
```

**Usage Flow:**
1. User POSTs to /auth/login with username & password
2. LocalAuthGuard triggers this strategy
3. Strategy calls `validate(username, password)`
4. Returns user if valid, throws if invalid
5. User object attached to request
6. Controller generates JWT token

---

## src/auth/guards/jwt-auth.guard.ts

```typescript
// Import NestJS decorators
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// @Injectable for dependency injection
@Injectable()
// Extend AuthGuard with 'jwt' strategy
// Why 'jwt'? Tells Passport to use JwtStrategy
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Override canActivate to add custom logic if needed
  // Currently just calls parent (but extendable)
  canActivate(context: ExecutionContext) {
    // Call parent's canActivate which:
    // 1. Extracts JWT from Authorization header
    // 2. Verifies signature
    // 3. Calls JwtStrategy.validate()
    // 4. Attaches user to request
    // Returns: boolean or Promise<boolean>
    return super.canActivate(context);
  }
}
```

**Why Extend?**
- Future customization point
- Can add logging, custom error messages, etc.
- Keeps guard logic centralized

**Usage:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute(@CurrentUser() user: User) {
  // Only executes if JWT valid
}
```

---

## src/auth/guards/roles.guard.ts

```typescript
// Import NestJS decorators and interfaces
import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Import UserRole enum and ROLES_KEY constant
import { UserRole } from '../../entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

// @Injectable for dependency injection
@Injectable()
// Implement CanActivate interface
// Why? Guards must implement canActivate method
export class RolesGuard implements CanActivate {
  // Inject Reflector to read decorator metadata
  // Why Reflector? Reads @Roles() decorator data
  constructor(private reflector: Reflector) {}

  // canActivate determines if request is allowed
  // context: Provides access to request, controller, handler
  // Returns: boolean (true = allowed, false = denied)
  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator
    // getAllAndOverride checks handler first, then controller
    // Why? Handler-level @Roles() overrides controller-level
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY, 
      [
        context.getHandler(),  // Method decorator
        context.getClass(),    // Controller decorator
      ]
    );

    // If no @Roles() decorator, allow access
    // Why? Routes without @Roles() are accessible to all authenticated users
    if (!requiredRoles) {
      return true;
    }

    // Get user from request (set by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    
    // If no user, reject request
    // Why 403 Forbidden? User authenticated but lacking permissions
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user's role matches any required role
    // some() returns true if any role matches
    // Why some? User needs at least one matching role
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    // If no matching role, reject request
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // User has required role, allow access
    return true;
  }
}
```

**Usage Example:**
```typescript
@Roles(UserRole.ADMIN)  // Only admins allowed
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete('users/:id')
async deleteUser(@Param('id') id: string) {
  // Only admin users reach here
}
```

**Why Two Exceptions?**
- `UnauthorizedException` (401): Not logged in
- `ForbiddenException` (403): Logged in but insufficient permissions

---

## src/auth/decorators/roles.decorator.ts

```typescript
// Import SetMetadata from NestJS
// SetMetadata: Attaches metadata to route handlers
import { SetMetadata } from '@nestjs/common';

// Import UserRole enum
import { UserRole } from '../../entities/user.entity';

// Define metadata key as constant
// Why constant? Prevents typos, easy to refactor
export const ROLES_KEY = 'roles';

// Create @Roles decorator
// ...roles: Variable number of arguments (ADMIN, USER, etc.)
// Returns: Decorator function
// Why function? Decorators are functions that modify classes/methods
export const Roles = (...roles: UserRole[]) => 
  // SetMetadata stores roles under ROLES_KEY
  // RolesGuard reads this metadata
  SetMetadata(ROLES_KEY, roles);
```

**Usage:**
```typescript
// Single role
@Roles(UserRole.ADMIN)

// Multiple roles (admin OR moderator)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)

// No @Roles() decorator = accessible to all authenticated users
```

---

## src/auth/decorators/current-user.decorator.ts

```typescript
// Import decorator factory
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Import User entity for type safety
import { User } from '../../entities/user.entity';

// Create custom parameter decorator
// createParamDecorator: Factory for creating decorators
// data: Optional argument passed to decorator
// ctx: Execution context with request data
// Returns: User object from request
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    // Switch context to HTTP (could be WebSocket, GraphQL, etc.)
    // getRequest(): Get underlying HTTP request object
    const request = ctx.switchToHttp().getRequest();
    
    // Return user object attached by JwtAuthGuard
    // Why from request? Guards attach validated user here
    return request.user;
  },
);
```

**Usage:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  // user is type-safe User object
  // No need to access request.user manually
  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
}
```

**Benefits:**
- **Type Safety**: TypeScript knows it's a User object
- **Clean Code**: No manual request.user access
- **Reusable**: Use in any controller method

---

## src/auth/auth.service.ts

```typescript
// Import NestJS decorators
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
// Import JWT service
import { JwtService } from '@nestjs/jwt';
// Import TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Import bcrypt for password hashing
import * as bcrypt from 'bcrypt';
// Import entities and DTOs
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    // Inject User repository for database operations
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // Inject JwtService for creating tokens
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param registerDto - Contains username, password, optional role
   * @returns User object and JWT token
   */
  async register(registerDto: RegisterDto): Promise<{ user: User; accessToken: string }> {
    // Destructure fields from DTO
    const { username, password, role } = registerDto;

    // Check if username already exists
    // Why? Usernames must be unique
    const existingUser = await this.userRepository.findOne({ 
      where: { username } 
    });
    
    // If user exists, throw 409 Conflict
    // Why 409? Resource conflict (username taken)
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Generate salt for password hashing
    // 10: Salt rounds - higher = slower but more secure
    // Why salt? Same password hashes differently each time
    const salt = await bcrypt.genSalt(10);
    
    // Hash password with salt
    // Why hash? Never store plain text passwords
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user entity
    // create() creates instance but doesn't save to DB
    const user = this.userRepository.create({
      username,
      password: hashedPassword,  // Store hashed password
      role: role || UserRole.USER, // Default to USER if not specified
    });

    // Save to database
    // Why separate create/save? Can modify entity before saving
    await this.userRepository.save(user);

    // Generate JWT token
    const accessToken = this.generateToken(user);

    // Return user and token
    return { user, accessToken };
  }

  /**
   * Login existing user
   * @param loginDto - Contains username and password
   * @returns User object and JWT token
   */
  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string }> {
    // Validate credentials
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    // If invalid, throw 401 Unauthorized
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate new token
    const accessToken = this.generateToken(user);
    
    return { user, accessToken };
  }

  /**
   * Validate user credentials
   * @param username - Username to check
   * @param password - Plain text password
   * @returns User if valid, null if invalid
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    // Find user by username and active status
    // Why isActive check? Deactivated users can't login
    const user = await this.userRepository.findOne({ 
      where: { username, isActive: true } 
    });
    
    // If user not found, return null
    if (!user) {
      return null;
    }

    // Compare plain password with hashed password
    // bcrypt.compare automatically handles salt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // If password wrong, return null
    if (!isPasswordValid) {
      return null;
    }

    // Credentials valid, return user
    return user;
  }

  /**
   * Generate JWT token for user
   * @param user - User to create token for
   * @returns Signed JWT token string
   */
  private generateToken(user: User): string {
    // Create token payload
    // JWT standard uses 'sub' for subject (user ID)
    const payload = {
      sub: user.id,           // Subject - user ID
      username: user.username, // Username for display
      role: user.role,        // Role for authorization
    };

    // Sign and return token
    // JwtService uses secret from configuration
    // Token auto-expires based on JWT_EXPIRATION setting
    return this.jwtService.sign(payload);
  }
}
```

**Security Notes:**
- **Never store plain passwords**: Always hash with bcrypt
- **Salt rounds (10)**: Balance between security and performance
- **isActive check**: Prevents banned users from accessing
- **Token expiration**: Tokens expire (default 1 hour)

---

## src/auth/auth.controller.ts

```typescript
// Import NestJS decorators
import { 
  Controller,    // Marks class as controller
  Post,         // HTTP POST decorator
  Body,         // Extracts request body
  UseGuards,    // Applies guards
  HttpCode,     // Sets response status code
  HttpStatus    // HTTP status constants
} from '@nestjs/common';

// Import service, DTOs, guards, decorators
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../entities/user.entity';

// @Controller('auth') - all routes start with /auth
@Controller('auth')
export class AuthController {
  // Inject AuthService via constructor
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register - Register new user
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Call service to register user
    const { user, accessToken } = await this.authService.register(registerDto);
    
    // Return formatted response
    // Why structure? Consistent API responses
    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        // Password excluded automatically by @Exclude() decorator
      },
      accessToken,  // JWT token for immediate login
    };
  }

  /**
   * POST /auth/login - Login existing user
   */
  @Post('login')
  // Set HTTP status to 200 OK (default POST is 201 Created)
  // Why 200? Login doesn't create resource, just authenticates
  @HttpCode(HttpStatus.OK)
  // Apply LocalAuthGuard to validate credentials
  // Guard calls LocalStrategy.validate()
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,      // Request body for validation
    @CurrentUser() user: User        // User from LocalAuthGuard
  ) {
    // User already validated by guard, generate token
    const { accessToken } = await this.authService.login(loginDto);
    
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      accessToken,
    };
  }
}
```

**Why Guard on Login?**
- LocalAuthGuard validates credentials before controller runs
- If credentials invalid, request rejected before reaching controller
- Controller only runs with valid user

---

# Scores Module

## src/scores/dto/create-score.dto.ts

```typescript
// Import validation decorators
import { 
  IsInt,        // Must be integer
  IsPositive,   // Must be > 0
  IsString,     // Must be string
  IsOptional,   // Field is optional
  IsUUID        // Must be valid UUID
} from 'class-validator';

export class CreateScoreDto {
  // Score value - must be positive integer
  // Why positive? Negative scores don't make sense
  // Why integer? Game scores are whole numbers
  @IsInt()
  @IsPositive()
  score: number;

  // Optional player name (for admin use)
  // Admin can specify username to submit score for
  @IsOptional()
  @IsString()
  playerName?: string;

  // Optional user ID (for admin use)
  // Admin can specify user ID directly
  @IsOptional()
  @IsUUID()  // Validates it's valid UUID format
  userId?: string;
}
```

**Two Ways for Admin:**
```typescript
// Admin submit by username
{ score: 1000, playerName: "john" }

// Admin submit by user ID
{ score: 1000, userId: "uuid-here" }

// Regular user (fields ignored)
{ score: 1000 }  // Uses authenticated user
```

---

## src/scores/guards/score-ownership.guard.ts

```typescript
// Import NestJS decorators
import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException 
} from '@nestjs/common';

// Import UserRole enum
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class ScoreOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Get request object
    const request = context.switchToHttp().getRequest();
    
    // Get authenticated user (from JwtAuthGuard)
    const user = request.user;
    
    // Get request body
    const body = request.body;

    // If no user, reject (shouldn't happen if JwtAuthGuard applied)
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins can submit scores for anyone
    // Why allow? Admins manage scores (corrections, events, etc.)
    if (user.role === UserRole.ADMIN) {
      return true;  // Allow immediately
    }

    // Regular users can only submit scores for themselves
    
    // Check if userId provided in body
    // If yes, must match authenticated user
    // Why? Prevent user from submitting as someone else
    if (body.userId && body.userId !== user.id) {
      throw new ForbiddenException('You can only submit scores for yourself');
    }

    // Check if playerName provided in body
    // If yes, must match authenticated user's username
    if (body.playerName && body.playerName !== user.username) {
      throw new ForbiddenException('Player name must match your username');
    }

    // All checks passed, allow
    return true;
  }
}
```

**Attack Scenarios Prevented:**
```typescript
// User A tries to submit score for User B
// User A authenticated as: { id: "uuid-a", username: "alice" }
// Body: { score: 1000, userId: "uuid-b" }
// Result: ❌ Forbidden - userId doesn't match

// User A tries with wrong playerName
// Body: { score: 1000, playerName: "bob" }
// Result: ❌ Forbidden - playerName doesn't match

// Admin submits for anyone
// Admin user: { role: "admin" }
// Body: { score: 1000, userId: "any-uuid" }
// Result: ✅ Allowed - admin bypass
```

---

## src/scores/scores.service.ts

```typescript
// Import NestJS decorators
import { Injectable, NotFoundException } from '@nestjs/common';
// Import TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Import entities and DTOs
import { Score } from '../entities/score.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateScoreDto } from './dto';

@Injectable()
export class ScoresService {
  constructor(
    // Inject Score repository
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    // Inject User repository (for admin operations)
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Create a new score entry
   * @param createScoreDto - Score data with optional userId/playerName
   * @param currentUser - Authenticated user from JWT
   * @returns Created score object
   */
  async createScore(createScoreDto: CreateScoreDto, currentUser: User): Promise<Score> {
    // Default to current user's ID
    let userId = currentUser.id;

    // If admin provides userId, use that instead
    if (currentUser.role === UserRole.ADMIN && createScoreDto.userId) {
      // Find target user by ID
      const targetUser = await this.userRepository.findOne({
        where: { id: createScoreDto.userId },
      });

      // If user doesn't exist, throw 404
      // Why 404? Admin specified non-existent user
      if (!targetUser) {
        throw new NotFoundException('Target user not found');
      }

      // Use target user's ID
      userId = targetUser.id;
    }

    // If admin provides playerName, find user by username
    if (currentUser.role === UserRole.ADMIN && createScoreDto.playerName) {
      // Find target user by username
      const targetUser = await this.userRepository.findOne({
        where: { username: createScoreDto.playerName },
      });

      // If player not found, throw 404
      if (!targetUser) {
        throw new NotFoundException('Player not found');
      }

      // Use target user's ID
      userId = targetUser.id;
    }

    // Create score entity
    const score = this.scoreRepository.create({
      score: createScoreDto.score,
      userId,  // Either current user or target user
    });

    // Save to database and return
    return this.scoreRepository.save(score);
  }

  /**
   * Get leaderboard (top scores)
   * @param limit - Number of top scores to return (default 10)
   * @returns Array of top scorers with rank
   */
  async getLeaderboard(limit: number = 10): Promise<any[]> {
    // Use query builder for complex aggregation
    // Why not simple find()? Need grouping and MAX function
    const scores = await this.scoreRepository
      .createQueryBuilder('score')  // Alias 'score' for table
      .leftJoinAndSelect('score.user', 'user')  // Join users table
      .select([
        'user.username as playerName',     // Get username
        'MAX(score.score) as score',       // Get highest score per user
        'MAX(score.createdAt) as achievedAt'  // When achieved
      ])
      .groupBy('user.id')           // Group by user (one row per user)
      .addGroupBy('user.username')  // Also group by username (for SELECT)
      .orderBy('score', 'DESC')     // Order by score descending
      .limit(limit)                 // Limit to top N
      .getRawMany();                // Get raw results (not entities)

    // Transform results to add rank
    // Why map? Add rank field (1st, 2nd, 3rd, etc.)
    return scores.map((entry, index) => ({
      rank: index + 1,              // Rank based on position
      playerName: entry.playerName,
      score: parseInt(entry.score, 10),  // Convert string to number
      achievedAt: entry.achievedAt,
    }));
  }

  /**
   * Get all scores for a specific user
   * @param userId - User ID to get scores for
   * @returns Array of user's scores
   */
  async getUserScores(userId: string): Promise<Score[]> {
    // Find all scores for user
    // order: Sort by score descending, then by date
    // take: Limit to 10 most recent/highest
    return this.scoreRepository.find({
      where: { userId },
      order: { 
        score: 'DESC',      // Highest first
        createdAt: 'DESC'   // Most recent first
      },
      take: 10,
    });
  }

  /**
   * Get user's highest score
   * @param userId - User ID
   * @returns Highest score or null if none
   */
  async getHighScore(userId: string): Promise<Score | null> {
    // Find single highest score
    // order: Descending by score
    return this.scoreRepository.findOne({
      where: { userId },
      order: { score: 'DESC' },
    });
  }
}
```

**Leaderboard Query Explained:**
```sql
-- Generated SQL (simplified)
SELECT 
  user.username as playerName,
  MAX(score.score) as score,
  MAX(score.createdAt) as achievedAt
FROM scores
LEFT JOIN users ON scores.userId = users.id
GROUP BY user.id, user.username
ORDER BY score DESC
LIMIT 10
```

**Why MAX(score)?**
- Users can have multiple scores
- Want each user's best score
- GROUP BY + MAX ensures one row per user with their highest score

---

This document continues with remaining files. Would you like me to continue with:
- Scores Controller
- Common utilities (logging, winston)
- Main application files (app.module.ts, main.ts)
- Docker configuration
- CI/CD configuration

Let me know and I'll add those sections!

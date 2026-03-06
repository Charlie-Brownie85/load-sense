-- CreateTable
CREATE TABLE "UserProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "age" INTEGER,
    "gender" TEXT,
    "height" REAL,
    "heightUnit" TEXT NOT NULL DEFAULT 'cm',
    "heightInches" INTEGER,
    "weight" REAL,
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "bodyFatPercent" REAL,
    "restingHr" INTEGER,
    "avatarBase64" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Key,
  Lock,
  RefreshCw,
  Shield,
  Unlock,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  feedback: string[];
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR_CHARS = "il1Lo0O";
const AMBIGUOUS_CHARS = "{}[]()/\\'\"`~,;.<>";

export default function PasswordGenerator() {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });

  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([]);
  const [customCharset, setCustomCharset] = useState<string>("");

  // Generate password based on options
  const generatePassword = useCallback(() => {
    let charset = "";

    if (options.includeUppercase) charset += UPPERCASE;
    if (options.includeLowercase) charset += LOWERCASE;
    if (options.includeNumbers) charset += NUMBERS;
    if (options.includeSymbols) charset += SYMBOLS;

    if (charset === "") {
      toast.error("Please select at least one character type");
      return;
    }

    // Remove similar characters if option is enabled
    if (options.excludeSimilar) {
      charset = charset
        .split("")
        .filter(char => !SIMILAR_CHARS.includes(char))
        .join("");
    }

    // Remove ambiguous characters if option is enabled
    if (options.excludeAmbiguous) {
      charset = charset
        .split("")
        .filter(char => !AMBIGUOUS_CHARS.includes(char))
        .join("");
    }

    let generatedPassword = "";
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
    setCopied(false);
  }, [options]);

  // Generate password with custom charset
  const generateCustomPassword = useCallback(() => {
    if (customCharset.trim() === "") {
      toast.error("Please enter custom characters");
      return;
    }

    let charset = customCharset;

    if (options.excludeSimilar) {
      charset = charset
        .split("")
        .filter(char => !SIMILAR_CHARS.includes(char))
        .join("");
    }

    if (options.excludeAmbiguous) {
      charset = charset
        .split("")
        .filter(char => !AMBIGUOUS_CHARS.includes(char))
        .join("");
    }

    let generatedPassword = "";
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
    setCopied(false);
  }, [customCharset, options]);

  // Calculate password strength
  const calculatePasswordStrength = useCallback((pwd: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (pwd.length === 0) {
      return { score: 0, label: "No Password", color: "text-gray-500", feedback: [] };
    }

    // Length scoring
    if (pwd.length >= 8) score += 1;
    else feedback.push("Use at least 8 characters");

    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Character variety scoring
    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push("Add lowercase letters");

    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push("Add uppercase letters");

    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push("Add numbers");

    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    else feedback.push("Add special characters");

    // Pattern detection
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 1;
      feedback.push("Avoid repeated characters");
    }

    if (/123|abc|qwe/i.test(pwd)) {
      score -= 1;
      feedback.push("Avoid common patterns");
    }

    // Determine strength level
    let label: string;
    let color: string;

    if (score <= 2) {
      label = "Weak";
      color = "text-red-500";
    } else if (score <= 4) {
      label = "Fair";
      color = "text-orange-500";
    } else if (score <= 6) {
      label = "Good";
      color = "text-yellow-500";
    } else if (score <= 8) {
      label = "Strong";
      color = "text-green-500";
    } else {
      label = "Very Strong";
      color = "text-emerald-500";
    }

    return { score: Math.max(0, score), label, color, feedback };
  }, []);

  const passwordStrength = calculatePasswordStrength(password);

  // Copy password to clipboard
  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success("Password copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy password");
    }
  };

  // Save password to history
  const saveToHistory = () => {
    if (!password) return;

    setGeneratedPasswords(prev => {
      const newHistory = [password, ...prev.filter(p => p !== password)].slice(0, 10);
      return newHistory;
    });
    toast.success("Password saved to history");
  };

  // Generate password on component mount and when options change
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      generatePassword();
    }, 0);
  }, [generatePassword]);

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          {/* Password Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Generated Password
              </CardTitle>
              <CardDescription>Your secure password will appear below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="font-mono text-lg"
                  placeholder="Your secure password will appear here"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  disabled={!password}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={generatePassword}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Password Strength */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password Strength:</span>
                    <Badge variant="outline" className={`${passwordStrength.color} border-current`}>
                      <Shield className="mr-1 h-3 w-3" />
                      {passwordStrength.label}
                    </Badge>
                  </div>
                  <Progress value={(passwordStrength.score / 8) * 100} className="h-2" />
                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      {passwordStrength.feedback.join(", ")}
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex gap-2">
                <Button onClick={copyToClipboard} disabled={!password} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Password
                </Button>
                <Button
                  onClick={saveToHistory}
                  disabled={!password}
                  variant="outline"
                  className="flex-1"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Save to History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Options */}
          <Card>
            <CardHeader>
              <CardTitle>Password Options</CardTitle>
              <CardDescription>Customize your password generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="length">Password Length</Label>
                  <Badge variant="secondary">{options.length} characters</Badge>
                </div>
                <Slider
                  id="length"
                  min={4}
                  max={64}
                  step={1}
                  value={[options.length]}
                  onValueChange={([value]) => updateOption("length", value)}
                  className="w-full"
                />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>4</span>
                  <span>64</span>
                </div>
              </div>

              {/* Character Type Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Character Types</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.includeUppercase}
                      onCheckedChange={checked =>
                        updateOption("includeUppercase", checked as boolean)
                      }
                    />
                    <Label htmlFor="uppercase" className="text-sm">
                      Uppercase (A-Z)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={options.includeLowercase}
                      onCheckedChange={checked =>
                        updateOption("includeLowercase", checked as boolean)
                      }
                    />
                    <Label htmlFor="lowercase" className="text-sm">
                      Lowercase (a-z)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={options.includeNumbers}
                      onCheckedChange={checked =>
                        updateOption("includeNumbers", checked as boolean)
                      }
                    />
                    <Label htmlFor="numbers" className="text-sm">
                      Numbers (0-9)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={options.includeSymbols}
                      onCheckedChange={checked =>
                        updateOption("includeSymbols", checked as boolean)
                      }
                    />
                    <Label htmlFor="symbols" className="text-sm">
                      Symbols (!@#$...)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Advanced Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeSimilar"
                      checked={options.excludeSimilar}
                      onCheckedChange={checked =>
                        updateOption("excludeSimilar", checked as boolean)
                      }
                    />
                    <Label htmlFor="excludeSimilar" className="text-sm">
                      Exclude similar characters (il1Lo0O)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeAmbiguous"
                      checked={options.excludeAmbiguous}
                      onCheckedChange={checked =>
                        updateOption("excludeAmbiguous", checked as boolean)
                      }
                    />
                    <Label htmlFor="excludeAmbiguous" className="text-sm">
                      Exclude ambiguous characters ({}[]()...)
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Character Set</CardTitle>
              <CardDescription>Generate passwords using your own character set</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCharset">Custom Characters</Label>
                <Input
                  id="customCharset"
                  value={customCharset}
                  onChange={e => setCustomCharset(e.target.value)}
                  placeholder="Enter your custom characters (e.g., abc123!@#)"
                  className="font-mono"
                />
                <p className="text-muted-foreground text-xs">
                  Enter the characters you want to use for password generation
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateCustomPassword} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Custom Password
                </Button>
                <Button onClick={copyToClipboard} disabled={!password} variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password History</CardTitle>
              <CardDescription>Your recently generated passwords (stored locally)</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedPasswords.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-muted-foreground py-8 text-center"
                >
                  <Unlock className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p className="text-base font-medium">No passwords in history yet</p>
                  <p className="text-sm">Generate and save passwords to see them here</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {generatedPasswords.map((pwd, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-muted/30 flex items-center gap-2 rounded-lg border p-3"
                    >
                      <Input
                        type="password"
                        value={pwd}
                        readOnly
                        className="bg-background flex-1 font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(pwd);
                            toast.success("Password copied!");
                          } catch {
                            toast.error("Failed to copy password");
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPassword(pwd);
                          setCopied(false);
                        }}
                      >
                        Use
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

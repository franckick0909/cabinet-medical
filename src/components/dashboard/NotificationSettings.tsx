"use client";

import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import { GroupCheckbox } from "@/components/custom/GroupCheckbox";
import { Input } from "@/components/custom/Input";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Bell,
  Check,
  Clock,
  Mail,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  type: "email" | "sms" | "both";
  timing: string;
  enabled: boolean;
  recipients: string[];
}

export function NotificationSettings() {
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: "rdv-confirmation",
      name: "Confirmation de RDV",
      description: "Envoyer une confirmation 24h avant le RDV",
      type: "both",
      timing: "24h avant",
      enabled: true,
      recipients: ["patient"],
    },
    {
      id: "rdv-rappel",
      name: "Rappel de RDV",
      description: "Rappel 2h avant le RDV",
      type: "sms",
      timing: "2h avant",
      enabled: true,
      recipients: ["patient"],
    },
    {
      id: "rdv-annulation",
      name: "Annulation de RDV",
      description: "Notification immédiate en cas d'annulation",
      type: "both",
      timing: "Immédiat",
      enabled: true,
      recipients: ["patient", "infirmiere"],
    },
    {
      id: "nouveau-patient",
      name: "Nouveau Patient",
      description: "Notification quand un nouveau patient s'inscrit",
      type: "email",
      timing: "Immédiat",
      enabled: true,
      recipients: ["admin"],
    },
    {
      id: "planning-jour",
      name: "Planning du Jour",
      description: "Résumé du planning envoyé chaque matin",
      type: "email",
      timing: "8h00",
      enabled: false,
      recipients: ["infirmiere"],
    },
  ]);

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    username: "cabinet.harmonie@gmail.com",
    password: "",
    fromName: "Cabinet Harmonie",
  });

  const [smsSettings, setSmsSettings] = useState({
    provider: "twilio",
    apiKey: "",
    apiSecret: "",
    fromNumber: "+33123456789",
  });

  const toggleRule = (ruleId: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const getTypeIcon = (type: "email" | "sms" | "both") => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <MessageSquare className="w-4 h-4" />;
      case "both":
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: "email" | "sms" | "both") => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "sms":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "both":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Notifications
        </h2>
        <p className="text-muted-foreground">
          Configurez les notifications automatiques par email et SMS
        </p>
      </div>

      {/* Règles de notification */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Règles de Notification
        </h3>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                rule.enabled
                  ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                  : "border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <GroupCheckbox
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">
                        {rule.name}
                      </h4>
                      <Badge className={`text-xs ${getTypeColor(rule.type)}`}>
                        {getTypeIcon(rule.type)}
                        <span className="ml-1">
                          {rule.type === "both"
                            ? "Email + SMS"
                            : rule.type.toUpperCase()}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rule.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rule.timing}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {rule.recipients.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rule.enabled ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Configuration Email */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-500" />
          Configuration Email
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Serveur SMTP
            </label>
            <Input
              value={emailSettings.smtpServer}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  smtpServer: e.target.value,
                })
              }
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Port
            </label>
            <Input
              value={emailSettings.smtpPort}
              onChange={(e) =>
                setEmailSettings({ ...emailSettings, smtpPort: e.target.value })
              }
              placeholder="587"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email d&apos;envoi
            </label>
            <Input
              type="email"
              value={emailSettings.username}
              onChange={(e) =>
                setEmailSettings({ ...emailSettings, username: e.target.value })
              }
              placeholder="cabinet.harmonie@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom d&apos;expéditeur
            </label>
            <Input
              value={emailSettings.fromName}
              onChange={(e) =>
                setEmailSettings({ ...emailSettings, fromName: e.target.value })
              }
              placeholder="Cabinet Harmonie"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Mot de passe
            </label>
            <Input
              type="password"
              value={emailSettings.password}
              onChange={(e) =>
                setEmailSettings({ ...emailSettings, password: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outlined" className="mr-2">
            <Settings className="w-4 h-4 mr-2" />
            Tester la Configuration
          </Button>
          <Button>Sauvegarder</Button>
        </div>
      </Card>

      {/* Configuration SMS */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-500" />
          Configuration SMS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fournisseur
            </label>
            <select
              aria-label="Fournisseur"
              className="w-full p-2 border border-input rounded-md bg-background"
              value={smsSettings.provider}
              onChange={(e) =>
                setSmsSettings({ ...smsSettings, provider: e.target.value })
              }
            >
              <option value="twilio">Twilio</option>
              <option value="ovh">OVH SMS</option>
              <option value="orange">Orange SMS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Numéro d&apos;envoi
            </label>
            <Input
              value={smsSettings.fromNumber}
              onChange={(e) =>
                setSmsSettings({ ...smsSettings, fromNumber: e.target.value })
              }
              placeholder="+33123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Clé API
            </label>
            <Input
              value={smsSettings.apiKey}
              onChange={(e) =>
                setSmsSettings({ ...smsSettings, apiKey: e.target.value })
              }
              placeholder="Votre clé API"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Secret API
            </label>
            <Input
              type="password"
              value={smsSettings.apiSecret}
              onChange={(e) =>
                setSmsSettings({ ...smsSettings, apiSecret: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outlined" className="mr-2">
            <MessageSquare className="w-4 h-4 mr-2" />
            Envoyer SMS Test
          </Button>
          <Button>Sauvegarder</Button>
        </div>
      </Card>

      {/* Historique des notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          Historique Récent
        </h3>
        <div className="space-y-3">
          {[
            {
              type: "email",
              message: "Confirmation RDV envoyée à Marie Dubois",
              time: "Il y a 2h",
              status: "success",
            },
            {
              type: "sms",
              message: "Rappel RDV envoyé à Pierre Martin",
              time: "Il y a 3h",
              status: "success",
            },
            {
              type: "email",
              message: "Échec envoi à sophie@email.com",
              time: "Il y a 5h",
              status: "error",
            },
          ].map((notification, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  notification.status === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              {getTypeIcon(notification.type as "email" | "sms" | "both")}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.time}
                </p>
              </div>
              {notification.status === "success" ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

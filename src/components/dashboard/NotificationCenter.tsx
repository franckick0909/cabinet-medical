"use client";

import { Button } from "@/components/custom/Button";
import { Card } from "@/components/custom/Card";
import { Badge } from "@/components/ui/badge";
import type { Demande } from "@/types/demande";
import {
  Bell,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Settings,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface NotificationCenterProps {
  demandes: Demande[];
  onSendNotification: (demandeId: string, type: "sms" | "email") => void;
}

interface NotificationRule {
  id: string;
  name: string;
  type: "reminder" | "confirmation" | "follow-up";
  trigger: "24h" | "2h" | "30min" | "manual";
  channels: ("sms" | "email")[];
  active: boolean;
}

export function NotificationCenter({
  demandes,
  onSendNotification,
}: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "sent" | "settings">(
    "pending"
  );
  const [notificationRules, setNotificationRules] = useState<
    NotificationRule[]
  >([
    {
      id: "1",
      name: "Rappel 24h avant RDV",
      type: "reminder",
      trigger: "24h",
      channels: ["sms", "email"],
      active: true,
    },
    {
      id: "2",
      name: "Rappel 2h avant RDV",
      type: "reminder",
      trigger: "2h",
      channels: ["sms"],
      active: true,
    },
    {
      id: "3",
      name: "Confirmation RDV",
      type: "confirmation",
      trigger: "manual",
      channels: ["sms", "email"],
      active: true,
    },
    {
      id: "4",
      name: "Suivi post-soin",
      type: "follow-up",
      trigger: "24h",
      channels: ["email"],
      active: false,
    },
  ]);

  // Notifications en attente (basées sur les règles automatiques)
  const pendingNotifications = useMemo(() => {
    const now = new Date();
    const notifications: Array<{
      id: string;
      demande: Demande;
      type: "reminder" | "confirmation" | "follow-up";
      scheduledFor: Date;
      channels: ("sms" | "email")[];
    }> = [];

    demandes.forEach((demande) => {
      if (!demande.dateRdv || !demande.heureRdv) return;

      const rdvDateTime = new Date(`${demande.dateRdv}T${demande.heureRdv}`);

      // Rappel 24h avant
      const reminder24h = new Date(rdvDateTime.getTime() - 24 * 60 * 60 * 1000);
      if (
        reminder24h > now &&
        reminder24h.getTime() - now.getTime() < 60 * 60 * 1000
      ) {
        const rule = notificationRules.find(
          (r) => r.trigger === "24h" && r.type === "reminder" && r.active
        );
        if (rule) {
          notifications.push({
            id: `${demande.id}-24h`,
            demande,
            type: "reminder",
            scheduledFor: reminder24h,
            channels: rule.channels,
          });
        }
      }

      // Rappel 2h avant
      const reminder2h = new Date(rdvDateTime.getTime() - 2 * 60 * 60 * 1000);
      if (
        reminder2h > now &&
        reminder2h.getTime() - now.getTime() < 30 * 60 * 1000
      ) {
        const rule = notificationRules.find(
          (r) => r.trigger === "2h" && r.type === "reminder" && r.active
        );
        if (rule) {
          notifications.push({
            id: `${demande.id}-2h`,
            demande,
            type: "reminder",
            scheduledFor: reminder2h,
            channels: rule.channels,
          });
        }
      }
    });

    return notifications.sort(
      (a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime()
    );
  }, [demandes, notificationRules]);

  // Demandes nécessitant une confirmation manuelle
  const confirmationNeeded = useMemo(() => {
    return demandes.filter(
      (d) =>
        d.statut === "EN_ATTENTE" &&
        d.dateRdv &&
        new Date(d.dateRdv) > new Date()
    );
  }, [demandes]);

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "confirmation":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "follow-up":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const toggleRule = (ruleId: string) => {
    setNotificationRules((rules) =>
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const sendManualNotification = (demandeId: string, type: "sms" | "email") => {
    onSendNotification(demandeId, type);
    // Ici on pourrait ajouter une notification de succès
  };

  return (
    <div className="h-full flex flex-col bg-surface text-on-surface">
      {/* Header Material Design 3 */}
      <div className="flex-shrink-0 p-6 border-b border-outline-variant bg-surface/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="headline-medium text-on-surface">
              Centre de Notifications
            </h1>
            <p className="body-medium text-on-surface-variant">
              Gérez les rappels et notifications automatiques
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="tonal" className="secondary-container">
              {pendingNotifications.length} en attente
            </Badge>
            <Badge variant="outlined" className="tertiary-container">
              {confirmationNeeded.length} à confirmer
            </Badge>
          </div>
        </div>

        {/* Tabs Material Design 3 */}
        <div className="flex gap-2 mt-6">
          <Button
            variant={activeTab === "pending" ? "filled" : "text"}
            size="md"
            onClick={() => setActiveTab("pending")}
          >
            <Bell className="w-5 h-5 mr-2" />
            En attente ({pendingNotifications.length})
          </Button>
          <Button
            variant={activeTab === "sent" ? "filled" : "text"}
            size="md"
            onClick={() => setActiveTab("sent")}
          >
            <Send className="w-5 h-5 mr-2" />
            Confirmations ({confirmationNeeded.length})
          </Button>
          <Button
            variant={activeTab === "settings" ? "filled" : "text"}
            size="md"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-5 h-5 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "pending" && (
          <div className="space-y-6">
            <h2 className="title-large text-on-surface">
              Notifications automatiques en attente
            </h2>
            {pendingNotifications.length === 0 ? (
              <Card variant="elevated" className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-on-surface-variant mb-4" />
                <h3 className="title-medium text-on-surface mb-2">
                  Aucune notification en attente
                </h3>
                <p className="body-medium text-on-surface-variant">
                  Les notifications automatiques apparaîtront ici selon vos
                  règles configurées.
                </p>
              </Card>
            ) : (
              pendingNotifications.map((notification) => (
                <Card key={notification.id} variant="elevated" className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge
                          className={getNotificationTypeColor(
                            notification.type
                          )}
                        >
                          {notification.type === "reminder" && "Rappel"}
                          {notification.type === "confirmation" &&
                            "Confirmation"}
                          {notification.type === "follow-up" && "Suivi"}
                        </Badge>
                        <span className="body-small text-on-surface-variant">
                          Programmé pour{" "}
                          {notification.scheduledFor.toLocaleString("fr-FR")}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            {notification.demande.patient.prenom}{" "}
                            {notification.demande.patient.nom}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(
                              notification.demande.dateRdv!
                            ).toLocaleDateString("fr-FR")}{" "}
                            à {notification.demande.heureRdv}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{notification.demande.typeSoin}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Canaux:
                        </span>
                        {notification.channels.map((channel) => (
                          <Badge
                            key={channel}
                            variant="outlined"
                            className="text-xs"
                          >
                            {channel === "sms" ? (
                              <>
                                <MessageSquare className="w-3 h-3 mr-1" />
                                SMS
                              </>
                            ) : (
                              <>
                                <Mail className="w-3 h-3 mr-1" />
                                Email
                              </>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outlined" size="sm">
                        <X className="w-4 h-4" />
                        Annuler
                      </Button>
                      <Button size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer maintenant
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "sent" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Confirmations manuelles</h2>
            {confirmationNeeded.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">
                  Aucune confirmation nécessaire
                </h3>
                <p className="text-muted-foreground">
                  Tous les rendez-vous sont confirmés ou n&apos;ont pas besoin
                  de confirmation.
                </p>
              </Card>
            ) : (
              confirmationNeeded.map((demande) => (
                <Card key={demande.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">
                            {demande.patient.prenom} {demande.patient.nom}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{demande.patient.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{demande.patient.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(demande.dateRdv!).toLocaleDateString(
                              "fr-FR"
                            )}{" "}
                            à {demande.heureRdv}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{demande.typeSoin}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() =>
                          sendManualNotification(demande.id, "sms")
                        }
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        SMS
                      </Button>
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() =>
                          sendManualNotification(demande.id, "email")
                        }
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          sendManualNotification(demande.id, "sms");
                          sendManualNotification(demande.id, "email");
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Les deux
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">
              Paramètres des notifications
            </h2>

            <div className="space-y-4">
              <h3 className="font-medium">Règles automatiques</h3>
              {notificationRules.map((rule) => (
                <Card key={rule.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge className={getNotificationTypeColor(rule.type)}>
                          {rule.type === "reminder" && "Rappel"}
                          {rule.type === "confirmation" && "Confirmation"}
                          {rule.type === "follow-up" && "Suivi"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Déclencheur: {rule.trigger}</span>
                        <div className="flex items-center gap-1">
                          <span>Canaux:</span>
                          {rule.channels.map((channel) => (
                            <Badge
                              key={channel}
                              variant="outline"
                              className="text-xs"
                            >
                              {channel === "sms" ? "SMS" : "Email"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={rule.active ? "filled" : "outlined"}
                        size="sm"
                        onClick={() => toggleRule(rule.id)}
                      >
                        {rule.active ? "Actif" : "Inactif"}
                      </Button>
                      <Button variant="outlined" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <h3 className="font-medium mb-3">Paramètres généraux</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Notifications par email activées</span>
                  <Button variant="outlined" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notifications SMS activées</span>
                  <Button variant="outlined" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fuseau horaire</span>
                  <span className="text-sm text-muted-foreground">
                    Europe/Paris
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

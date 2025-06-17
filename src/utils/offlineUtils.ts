
import { useEventStore } from '@/stores/eventStore';

export class OfflineUtils {
  private static AUTO_BACKUP_KEY = 'jourm-auto-backup';
  private static BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  static startAutoBackup() {
    if (typeof window === 'undefined') return;

    const createAutoBackup = () => {
      try {
        const store = useEventStore.getState();
        const backup = store.createBackup();
        localStorage.setItem(this.AUTO_BACKUP_KEY, backup);
        console.log('Auto-backup created:', new Date().toISOString());
      } catch (error) {
        console.error('Auto-backup failed:', error);
      }
    };

    // Créer une sauvegarde immédiatement
    createAutoBackup();

    // Puis toutes les 5 minutes
    return setInterval(createAutoBackup, this.BACKUP_INTERVAL);
  }

  static getAutoBackup(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.AUTO_BACKUP_KEY);
  }

  static restoreAutoBackup(): boolean {
    try {
      const backup = this.getAutoBackup();
      if (!backup) return false;

      const store = useEventStore.getState();
      return store.restoreFromBackup(backup);
    } catch (error) {
      console.error('Auto-restore failed:', error);
      return false;
    }
  }

  static clearAutoBackup() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.AUTO_BACKUP_KEY);
  }

  static getStorageInfo() {
    if (typeof window === 'undefined') return { used: 0, available: 0 };

    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      // Estimation de l'espace disponible (5MB pour la plupart des navigateurs)
      const available = 5 * 1024 * 1024; // 5MB en bytes
      
      return { used, available };
    } catch (error) {
      return { used: 0, available: 0 };
    }
  }

  static optimizeStorage() {
    if (typeof window === 'undefined') return;

    try {
      // Supprimer les anciennes sauvegardes automatiques si nécessaire
      const storageInfo = this.getStorageInfo();
      const usagePercentage = (storageInfo.used / storageInfo.available) * 100;

      if (usagePercentage > 80) {
        console.log('Storage optimization: clearing old auto-backups');
        this.clearAutoBackup();
      }
    } catch (error) {
      console.error('Storage optimization failed:', error);
    }
  }
}

// Démarrer la sauvegarde automatique au chargement
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    OfflineUtils.startAutoBackup();
  });

  // Optimiser le stockage périodiquement
  setInterval(() => {
    OfflineUtils.optimizeStorage();
  }, 30 * 60 * 1000); // Toutes les 30 minutes
}

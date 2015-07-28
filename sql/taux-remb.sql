-- en fonction du cntf_acte récupérer cntf_taux_caisse pour récupérer le taux de remboursement
SELECT * FROM actipharm.p01cntf01
GROUP BY cntf_acte, cntf_acte_mc, cntf_taux_caisse
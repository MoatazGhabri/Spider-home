<?php
// src/Controller/Api/DeviceController.php
namespace SuplaBundle\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DeviceController extends AbstractController
{
    // Pas besoin de répéter le préfixe /api, Symfony l'ajoute automatiquement via routing.yml
    #[Route('/devices', methods: ['GET'])]
    public function getDevices(): JsonResponse
    {
        return $this->json([
            'devices' => ['Light Bulb', 'Thermostat', 'Smart Plug']
        ]);
    }
}

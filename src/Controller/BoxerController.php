<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Boxer;
use App\Service\Router;
use App\Service\Templating;

class BoxerController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $boxers = Boxer::findAll();
        $html = $templating->render('boxer/index_boxer.php', [
            'boxers' => $boxers,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $boxer = Boxer::fromArray($requestPost);
            $boxer->save();

            $path = $router->generatePath('boxer-index');
            $router->redirect($path);
            return null;
        } else {
            $boxer = new Boxer();
        }

        $html = $templating->render('boxer/create_boxer.php', [
            'boxer' => $boxer,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $boxerId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $boxer = Boxer::find($boxerId);
        if (! $boxer) {
            throw new NotFoundException("Missing boxer with id $boxerId");
        }

        if ($requestPost) {
            $boxer->fill($requestPost);
            $boxer->save();

            $path = $router->generatePath('boxer-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('boxer/edit_boxer.php', [
            'boxer' => $boxer,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $boxerId, Templating $templating, Router $router): ?string
    {
        $boxer = Boxer::find($boxerId);
        if (! $boxer) {
            throw new NotFoundException("Missing boxer with id $boxerId");
        }

        $html = $templating->render('boxer/show_boxer.php', [
            'boxer' => $boxer,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $boxerId, Router $router): ?string
    {
        $boxer = Boxer::find($boxerId);
        if (! $boxer) {
            throw new NotFoundException("Missing boxer with id $boxerId");
        }

        $boxer->delete();
        $path = $router->generatePath('boxer-index');
        $router->redirect($path);
        return null;
    }
}
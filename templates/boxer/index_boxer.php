<?php
/** @var \App\Model\Boxer[] $boxers */
/** @var \App\Service\Router $router */

$title = 'Boxer List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Boxer List</h1>
    <a href="<?= $router->generatePath('boxer-create') ?>">Add new Boxer</a>

    <ul class="index-list">
        <?php foreach ($boxers as $boxer): ?>
            <li>
                <h3><?= $boxer->getName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('boxer-show', ['id' => $boxer->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('boxer-edit', ['id' => $boxer->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';